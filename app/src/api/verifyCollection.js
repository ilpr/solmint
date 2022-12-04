import { web3 } from '@project-serum/anchor'
import { useWorkspace } from '@/composables'

export const verifyCollection = async(
    itemMetadataAccount,
    collectionNft
  ) => {

    const { wallet, program } = useWorkspace();
    const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
  
    try {
      const tx = await program.value
        .methods
        .verifyCollection()
        .accounts({
          payer: wallet.value.publicKey,
          itemMetadataAccount: itemMetadataAccount,
          collectionMint: collectionNft.address,
          collectionMetadataAccount: collectionNft.metadataAddress,
          collectionMasterEdition: collectionNft.edition.address,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID
        })
        .signers([])
        .rpc()
      ;

      return { tx }
    } catch (err) {
      console.log(err);
      return err
    }
  }
