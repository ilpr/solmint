import { web3 } from '@project-serum/anchor'
import { useWorkspace } from '@/composables'
import { verifyCollection } from './verifyCollection'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Metaplex } from "@metaplex-foundation/js"

export const mintNft = async (
  receiver,
  name,
  symbol,
  uri,
  sellerFee,
  isMutable,
  collection,
  creators
) => {

  const { wallet, provider, program } = useWorkspace();
  const metaplex = new Metaplex(provider.value.connection);
  const mint = web3.Keypair.generate();
  const tokenAccount = web3.Keypair.generate();
  const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const rent = web3.SYSVAR_RENT_PUBKEY;
  
  let receiverAddress = null;
  let updatedCreators = null;
  let collectionAddress = null;
  let collectionNft = null;

  try {

    updatedCreators = creators.map(creator => {
      return {
        address: new web3.PublicKey(creator.address),
        share: creator.share
      }
    });
    receiverAddress = new web3.PublicKey(receiver);

    if (collection !== "") {

      collectionAddress = new web3.PublicKey(collection);

      collectionNft = await metaplex.nfts().findByMint({ mintAddress: collectionAddress });
      
      if (collectionNft.updateAuthorityAddress.toBase58() !== wallet.value.publicKey.toBase58()) {
        throw Error("You are not the collection authority.");
      }
    }

  } catch (err) {
    return err;
  }

  // eslint-disable-next-line
  const [metadataAccount, _bumpMeta] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.publicKey.toBuffer()
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  // eslint-disable-next-line
  const [masterEdition, _bumpEdition] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.publicKey.toBuffer(),
      Buffer.from("edition")
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  try {
    const tx = await program.value
      .methods
      .mintNft(
        name,
        symbol,
        uri,
        updatedCreators,
        sellerFee,
        isMutable,
        collectionAddress,
        null
      )
      .accounts({
        payer: wallet.value.publicKey,
        receiver: receiverAddress,
        mint: mint.publicKey,
        tokenAccount: tokenAccount.publicKey,
        metadataAccount: metadataAccount,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        masterEdition: masterEdition,
        rent: rent,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId
      })
      .signers([mint, tokenAccount])
      .rpc()
    ;

    const nft = await metaplex.nfts().findByMint({ mintAddress: mint.publicKey });
    
    if (nft.collection !== null) {
      await verifyCollection(
        metadataAccount,
        collectionNft
      );
    }

    return { tx, nft }
  } catch (err) {
    return err
  }
}
