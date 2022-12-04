use anchor_lang::prelude::*;
use anchor_lang::solana_program::program as solana;
use anchor_spl::token::{
    self,
    Mint,
    MintTo,
    Token,
    TokenAccount
};
use mpl_token_metadata::{
    ID as TMP_ID,
    state,
    instruction as mpl
};
use bytemuck;

declare_id!("GvGUNhrtzUUwhP9PCgF24m7KWtvU4zQCFyjDpvtyRAaP");

const METADATA_SEED: &[u8] = b"metadata";
const EDITION_SEED: &[u8] = b"edition";

#[program]
pub mod solmint {
    use super::*;

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        symbol: String,
        uri: String,
        creators: Vec<Creator>,
        seller_fee_basis_points: u16,
        is_mutable: bool,
        collection_key: Option<Pubkey>,
        collection_details: Option<u64>
    ) -> Result<()> {

        // CPI for minting the NFT token.
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info()
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts
        );
        token::mint_to(cpi_ctx, 1)?;

        // Creators.
        let creators = if let true = creators.is_empty() {
            None
        } else {
            Some(creators
                .iter()
                .map(|c| {

                    let verified = if c.address == ctx.accounts.payer.key() {
                        true
                    } else {
                        false
                    };

                    state::Creator {
                        address: c.address,
                        verified,
                        share: c.share
                    }
                })
                .collect::<Vec<state::Creator>>()
            )
        };

        // Collection.
        let collection = if let Some(key) = collection_key {
            Some(state::Collection{
                verified: false,
                key
            })
        } else {
            None
        };

        // Collection details.
        let collection_details = if let Some(num) = collection_details {
            Some(state::CollectionDetails::V1 { size: num })
        } else {
            None
        };

        // CPI for creating a metadata account for the NFT.
        let metadata_ix = mpl::create_metadata_accounts_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata_account.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            name,
            symbol,
            uri,
            creators,
            seller_fee_basis_points,
            true,
            is_mutable,
            collection,
            None,
            collection_details
        );
        let account_infos = vec![
            ctx.accounts.metadata_account.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info()
        ];
        solana::invoke(
            &metadata_ix,
            &account_infos
        )?;

        // CPI for creating Master Edition.
        let master_edition_ix = mpl::create_master_edition_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.master_edition.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.metadata_account.key(),
            ctx.accounts.payer.key(),
            Some(0)
        );
        let account_infos = vec![
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.metadata_account.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info()
        ];
        solana::invoke(
            &master_edition_ix,
            &account_infos
        )?;

        Ok(())
    }

    pub fn verify_collection(ctx: Context<VerifyCollection>) -> Result<()> {

        // CPI for verifying the collection item.
        let ix = mpl::verify_sized_collection_item(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.item_metadata_account.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.collection_mint.key(),
            ctx.accounts.collection_metadata_account.key(),
            ctx.accounts.collection_master_edition.key(),
            None
        );
        let account_infos = vec![
            ctx.accounts.item_metadata_account.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.collection_mint.to_account_info(),
            ctx.accounts.collection_metadata_account.to_account_info(),
            ctx.accounts.collection_master_edition.to_account_info()
        ];
        solana::invoke(
            &ix,
            &account_infos
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    /// CHECK: Payer of the transaction costs; must be a signer
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Receiver of the NFT token
    pub receiver: UncheckedAccount<'info>,
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
        mint::freeze_authority = payer
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = payer,
        token::mint = mint,
        token::authority = receiver
    )]
    pub token_account: Account<'info, TokenAccount>,
    /// CHECK: Metadata account to pass into Metaplex Token Metadata Program; must be mutable
    #[account(
        mut,
        seeds = [
            METADATA_SEED,
            bytemuck::bytes_of(&TMP_ID),
            bytemuck::bytes_of(&mint.key())
        ],
        bump,
        seeds::program = token_metadata_program.key()
    )]
    pub metadata_account: UncheckedAccount<'info>,
    /// CHECK: Master Edition account to pass into Metaplex Token Metadata Program
    #[account(
        mut,
        seeds = [
            METADATA_SEED,
            bytemuck::bytes_of(&TMP_ID),
            bytemuck::bytes_of(&mint.key()),
            EDITION_SEED
        ],
        bump,
        seeds::program = token_metadata_program.key()
    )]
    pub master_edition: UncheckedAccount<'info>,
    /// CHECK: Metaplex Token Metadata Program for invoking it
    #[account(
        address = TMP_ID @ErrorCode::IncorrectTokenMetadataProgramID
    )]
    pub token_metadata_program: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>
}

#[derive(Accounts)]
pub struct VerifyCollection<'info> {
    /// CHECK: Payer of the transaction costs; must be a signer
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Metadata account to pass into Metaplex Token Metadata Program; must be mutable
    #[account(mut)]
    pub item_metadata_account: UncheckedAccount<'info>,
    pub collection_mint: Account<'info, Mint>,
    /// CHECK: Metadata account to pass into Metaplex Token Metadata Program; must be mutable
    #[account(mut)]
    pub collection_metadata_account: UncheckedAccount<'info>,
    /// CHECK: Master Edition account to pass into Metaplex Token Metadata Program
    pub collection_master_edition: UncheckedAccount<'info>,
    /// CHECK: Metaplex Token Metadata Program for invoking it
    #[account(
        address = TMP_ID @ErrorCode::IncorrectTokenMetadataProgramID
    )]
    pub token_metadata_program: UncheckedAccount<'info>
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq)]
pub struct Creator {
    address: Pubkey,
    share: u8
}

#[error_code]
pub enum ErrorCode {
    #[msg("Incorrect Token Metadata program ID")]
    IncorrectTokenMetadataProgramID
}
