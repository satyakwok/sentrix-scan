"use client";

import { useMemo, useState } from "react";
import { Blocks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/components/common/Address";
import { BlockHeight } from "@/components/common/BlockHeight";
import { Timestamp } from "@/components/common/Timestamp";
import { Copyable } from "@/components/common/Copyable";
import { Pagination } from "@/components/common/Pagination";
import { useNetwork } from "@/lib/network-context";
import { useBlocks } from "@/lib/hooks";
import { shortenHash } from "@/lib/format";

const PAGE_SIZE = 25;
const BATCH = 100;

export default function BlocksPage() {
  const { network } = useNetwork();
  // DECISION: fetch a rolling batch (100) and paginate client-side — backend has no pagination endpoint yet.
  // TODO(api): needs GET /chain/blocks?page=N&limit=M — using client-side slice for now
  const { data: blocks, loading } = useBlocks(network, BATCH);
  const [page, setPage] = useState(1);

  const totalPages = blocks ? Math.max(1, Math.ceil(blocks.length / PAGE_SIZE)) : 1;
  const paged = useMemo(() => {
    if (!blocks) return [];
    const start = (page - 1) * PAGE_SIZE;
    return blocks.slice(start, start + PAGE_SIZE);
  }, [blocks, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Blocks className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Blocks</h1>
        {blocks && <span className="text-sm text-muted-foreground">{blocks.length} most recent</span>}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Latest blocks on {network === "mainnet" ? "Mainnet (Chain ID 7119)" : "Testnet (Chain ID 7120)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && !blocks ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground bg-muted/30">
                      <th className="px-4 py-2.5 font-medium">Block</th>
                      <th className="px-4 py-2.5 font-medium">Age</th>
                      <th className="px-4 py-2.5 font-medium text-center">Txs</th>
                      <th className="px-4 py-2.5 font-medium hidden md:table-cell">Hash</th>
                      <th className="px-4 py-2.5 font-medium">Validator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paged.map((block) => (
                      <tr key={block.index} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2.5">
                          <BlockHeight height={block.index} className="text-sm" />
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">
                          <Timestamp timestamp={block.timestamp} />
                        </td>
                        <td className="px-4 py-2.5 text-center">{block.transactions?.length || 0}</td>
                        <td className="px-4 py-2.5 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1">
                            <span className="font-mono text-xs text-muted-foreground">{shortenHash(block.hash)}</span>
                            <Copyable text={block.hash} bare />
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          {block.validator_name ? (
                            <Address address={block.validator} label={block.validator_name} muted showCopy={false} className="text-xs" />
                          ) : (
                            <Address address={block.validator} muted showCopy={false} className="text-xs" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!blocks || blocks.length === 0) && (
                  <div className="p-8 text-center text-sm text-muted-foreground">No blocks found.</div>
                )}
              </div>
              {blocks && blocks.length > PAGE_SIZE && (
                <div className="border-t border-border">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
