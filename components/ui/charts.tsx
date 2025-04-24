"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

// Bar Chart Component
export function BarChart({ data }: { data: { name: string; value: number }[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: "Количество",
            data: data.map((item) => item.value),
            backgroundColor: ["rgba(99, 102, 241, 0.7)", "rgba(79, 70, 229, 0.7)", "rgba(59, 130, 246, 0.7)"],
            borderColor: ["rgba(99, 102, 241, 1)", "rgba(79, 70, 229, 1)", "rgba(59, 130, 246, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}

// Line Chart Component
export function LineChart({ data }: { data: { name: string; value: number }[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: "Продажи",
            data: data.map((item) => item.value),
            fill: false,
            borderColor: "rgba(99, 102, 241, 1)",
            tension: 0.1,
            backgroundColor: "rgba(99, 102, 241, 0.5)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}

// Pie Chart Component
export function PieChart({ data }: { data: { name: string; value: number }[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Generate colors
    const backgroundColors = data.map((_, index) => {
      const hue = (index * 137) % 360 // Use golden angle approximation for nice color distribution
      return `hsla(${hue}, 70%, 60%, 0.7)`
    })

    const borderColors = data.map((_, index) => {
      const hue = (index * 137) % 360
      return `hsla(${hue}, 70%, 60%, 1)`
    })

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: "Количество",
            data: data.map((item) => item.value),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
