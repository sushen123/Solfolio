"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Protocol } from "@/lib/dummy-protocols"

export function ProtocolViewTable({ protocols }: { protocols: Protocol[] }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Protocol View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead className="text-muted-foreground">
                  Protocol
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Total Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols.map((protocol: Protocol) => (
                <React.Fragment key={protocol.id}>
                  <TableRow
                    onClick={() => toggleRow(protocol.id)}
                    className="cursor-pointer border-border hover:bg-muted/50"
                  >
                    <TableCell>
                      {expandedRows[protocol.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Image
                          src={protocol.logo}
                          alt={protocol.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <p className="text-foreground">{protocol.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      $
                      {protocol.value.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  {expandedRows[protocol.id] && (
                    <TableRow key={`${protocol.id}-details`} className="bg-muted/20 hover:bg-muted/20">
                      <TableCell colSpan={3}>
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">Assets in {protocol.name}</h4>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground">Asset</TableHead>
                                <TableHead className="text-right text-muted-foreground">Value</TableHead>
                                <TableHead className="text-right text-muted-foreground">APY / Floor</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {protocol.assets.map((asset) => (
                                <TableRow key={asset.id} className="border-border hover:bg-muted/50">
                                  <TableCell className="font-medium">
                                    <div>
                                      <p className="text-foreground">{asset.name}</p>
                                      <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right text-foreground">
                                    ${asset.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                                  </TableCell>
                                  <TableCell className="text-right text-foreground">
                                    {asset.apy ? `${asset.apy}% APY` : asset.floorPrice ? `${asset.floorPrice} SOL` : "-"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
