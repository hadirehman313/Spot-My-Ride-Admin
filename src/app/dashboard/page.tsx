// app/dashboard/page.tsx
"use client";

import React from "react";

import Card from "./Card";
import Graph from "./Graph";
export default function Dashboard() {
  return (
    <div>
      <Card />
      <Graph />
    </div>
  );
}
