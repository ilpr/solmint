import * as anchor from "@project-serum/anchor";
import { Wallet, Program } from "@project-serum/anchor";
import { Solmint } from "../target/types/solmint";
import { TOKEN_PROGRAM_ID, getMint } from '@solana/spl-token'
import { Metaplex } from "@metaplex-foundation/js";
import * as assert from "assert";
const { LAMPORTS_PER_SOL } = require("@solana/web3.js")

describe("solmint", () => {

  // Configure connection and workspace.
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as Wallet;
  anchor.setProvider(provider);
  const program = anchor.workspace.Solmint as Program<Solmint>;

  // Configure Metaplex.
  const metaplex = new Metaplex(provider.connection);

  // Constants.
  const payer = anchor.web3.Keypair.generate();
  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const tokenProgram = TOKEN_PROGRAM_ID;
  const systemProgram = anchor.web3.SystemProgram.programId;

  // NFTs.
  let nft = null;
  let collectionNft = null;

  it("Mint collection NFT", async () => {

    // Accounts.
    const mint = anchor.web3.Keypair.generate();
    const tokenAccount = anchor.web3.Keypair.generate();
    const rent = anchor.web3.SYSVAR_RENT_PUBKEY;

    // Mock data.
    const name = "Test collection";
    const symbol = "TC";
    const uri = "Test uri";
    const creators = [
      {
        address: payer.publicKey,
        share: 50
      },
      {
        address: anchor.web3.Keypair.generate().publicKey,
        share: 50
      }
    ];
    const sellerFeeBasisPoints = 1000;
    const collectionSize = new anchor.BN(100);

    // Funding payer's account.
    const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash();
    const airdropSignature = await provider.connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: airdropSignature
    });

    // Get PDAs for Metadata and Edition accounts.
    const [metadataAccount, _bumpMeta] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const [masterEdition, _bumpEdition] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
        Buffer.from("edition")
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Run the program.
    await program
      .methods
      .mintNft(
        name,
        symbol,
        uri,
        creators,
        sellerFeeBasisPoints,
        true,
        null,
        collectionSize
      )
      .accounts({
        payer: payer.publicKey,
        receiver: payer.publicKey,
        mint: mint.publicKey,
        tokenAccount: tokenAccount.publicKey,
        metadataAccount: metadataAccount,
        masterEdition: masterEdition,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: tokenProgram,
        systemProgram: systemProgram,
        rent: rent
      })
      .signers([payer, mint, tokenAccount])
      .rpc()
    ;

    // Get the NFT info.
    collectionNft = await metaplex.nfts().findByMint({ mintAddress: mint.publicKey });

    // Assert that the data is as expected.
    assert.equal(
      collectionNft.address.toBase58(),
      mint.publicKey.toBase58()
    );
    assert.equal(
      collectionNft.updateAuthorityAddress.toBase58(),
      payer.publicKey.toBase58()
    );
    assert.equal(
      collectionNft.name,
      name
    );
    assert.equal(
      collectionNft.symbol,
      symbol
    );
    assert.equal(
      collectionNft.uri,
      uri
    );
    assert.equal(
      collectionNft.metadataAddress.toBase58(),
      metadataAccount.toBase58()
    );
    assert.equal(
      collectionNft.creators[0].address.toBase58(),
      payer.publicKey.toBase58()
    );

    assert.ok(collectionNft.creators[0].verified == true);
    assert.ok(collectionNft.creators[1].verified == false);

    assert.ok(collectionNft.collectionDetails !== null);

    // Get the mint info and assert that its authority is as expected.
    let mintInfo = await getMint(
      provider.connection,
      mint.publicKey
    );
    assert.equal(
      mintInfo.mintAuthority.toBase58(),
      masterEdition.toBase58()
    );
  });

  it("Mint regular NFT and verify it as a collection item", async () => {

    const receiver = anchor.web3.Keypair.generate();
    const mint = anchor.web3.Keypair.generate();
    const tokenAccount = anchor.web3.Keypair.generate();
    const rent = anchor.web3.SYSVAR_RENT_PUBKEY;

    const [metadataAccount, _bumpMeta] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const [masterEdition, _bumpEdition] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
        Buffer.from("edition")
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    await program
      .methods
      .mintNft(
        "Test nft",
        "TN",
        "Another test uri",
        [{
          address: payer.publicKey,
          share: 100
        }],
        500,
        true,
        collectionNft.mint.address,
        null
      )
      .accounts({
        payer: payer.publicKey,
        receiver: receiver.publicKey,
        mint: mint.publicKey,
        tokenAccount: tokenAccount.publicKey,
        metadataAccount: metadataAccount,
        masterEdition: masterEdition,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: tokenProgram,
        systemProgram: systemProgram,
        rent: rent
      })
      .signers([payer, mint, tokenAccount])
      .rpc()
    ;

    nft = await metaplex.nfts().findByMint({ mintAddress: mint.publicKey });

    assert.equal(
      nft.collection.address.toBase58(),
      collectionNft.address.toBase58()
    );
    assert.ok(nft.collection.verified == false);

    
    await program
      .methods
      .verifyCollection()
      .accounts({
        payer: payer.publicKey,
        itemMetadataAccount: metadataAccount,
        collectionMint: collectionNft.address,
        collectionMetadataAccount: collectionNft.metadataAddress,
        collectionMasterEdition: collectionNft.edition.address,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID
      })
      .signers([payer])
      .rpc()
    ;

    nft = await metaplex.nfts().findByMint({ mintAddress: mint.publicKey });

    assert.ok(nft.collection.verified == true);

  });
});
