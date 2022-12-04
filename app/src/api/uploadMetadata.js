import {
  Metaplex,
  walletAdapterIdentity,
  bundlrStorage,
  toMetaplexFileFromBrowser
} from "@metaplex-foundation/js"
import { useWorkspace } from '@/composables'
import { useWallet } from 'solana-wallets-vue'

export const uploadMetadata = async(
  name,
  symbol,
  description,
  imageFile,
  externalUrl
) => {

  const { connection } = useWorkspace();
  const { wallet } = useWallet();

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet.value.adapter))
    .use(bundlrStorage())
  ;

  try {

    const { uri } = await metaplex.nfts().uploadMetadata({
      name,
      symbol,
      description,
      image: await toMetaplexFileFromBrowser(imageFile),
      external_url: externalUrl
    });

    return { uri }

  } catch (err) {

    console.log(err);
    return err
  }
}
