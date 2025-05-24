// components/PredictionCard.tsx
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Button, Typography, Collapse } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PredictionData {
  category: string;
  predictedAmount: number;
  explanation: string;
}

interface PredictionCardProps {
  predictions: PredictionData[];
}

export default function PredictionCard({ predictions }: PredictionCardProps) {
  const [open, setOpen] = useState(false);

  const data = {
    labels: predictions.map((p) => p.category),
    datasets: [
      {
        label: "Prévision (€)",
        data: predictions.map((p) => p.predictedAmount),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <Button variant="contained" onClick={() => setOpen(!open)}>
        {open ? "Masquer les prédictions" : "Afficher les prédictions"}
      </Button>

      <Collapse in={open}>
        <div style={{ marginTop: "1rem" }}>
          <Bar data={data} />
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <Typography variant="h6">Explications</Typography>
          {predictions.map((p, index) => (
            <div key={index} style={{ marginTop: "0.5rem" }}>
              <Typography variant="subtitle1">{p.category}</Typography>
              <Typography variant="body2">{p.explanation}</Typography>
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
