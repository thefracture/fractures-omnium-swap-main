import {
  Metadata,
  MetadataData,
} from "@metaplex-foundation/mpl-token-metadata";
import { MetadataJson } from "@metaplex/js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import fracturesArr from "./fractures.json";

export const fractures = fracturesArr.reduce(
  (prev, mint) => ({ ...prev, [mint]: true }),
  {}
);

export interface FracturesMetadata {
  mint: string;
}
export const getFracturesInWallet = (
  connection: Connection,
  wallet: PublicKey
): Promise<FracturesMetadata[]> =>
connection.getParsedTokenAccountsByOwner(wallet, {programId: TOKEN_PROGRAM_ID}).then(
  // @ts-ignore
    (nfts) => nfts.value.map(item => item.account.data.parsed.info).filter((nft) => fractures[nft.mint])
    // Promise.all(
    //   nfts
    //     .filter((item) => fractures[item.mint])
    //     .map(async (nft) => ({
    //       ...nft,
    //       metadata: await fetch(nft.data.uri).then((res) => res.json() as any),
    //     }))
    // )
  );
