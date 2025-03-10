
import React from "react";
import { Client } from "@/data/clientsData";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="border rounded-md p-4">
      <div className="text-sm font-medium text-muted-foreground mb-1">Client</div>
      <div className="font-medium text-lg">{client.name}</div>
      <div className="text-sm">
        <span className="text-muted-foreground">ID:</span> {client.id} •{" "}
        <span className="text-muted-foreground">Tél:</span> {client.phone}
      </div>
      {client.email && (
        <div className="text-sm">
          <span className="text-muted-foreground">Email:</span> {client.email}
        </div>
      )}
      {client.address && (
        <div className="text-sm">
          <span className="text-muted-foreground">Adresse:</span> {client.address}
        </div>
      )}
    </div>
  );
}
