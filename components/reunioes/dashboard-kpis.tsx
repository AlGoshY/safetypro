"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, AlertTriangle, Clock8, TrendingUp } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend: {
    value: string
    positive: boolean
  }
  iconBgColor: string
  iconColor: string
}

export function KpiCard({ title, value, icon, trend, iconBgColor, iconColor }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className={`${iconBgColor} p-2 rounded-full mr-4`}>{icon}</div>
          <div>
            <div className="text-3xl font-bold">{value}</div>
            <div className={`text-xs ${trend.positive ? "text-green-600" : "text-red-600"} flex items-center`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend.value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardKpisProps {
  period: string
  unit?: string
  meetingType?: string
}

export default function DashboardKpis({ period, unit, meetingType }: DashboardKpisProps) {
  // Dados simulados - em uma implementação real, estes viriam de uma API
  const kpiData = {
    totalReunioes: {
      value: 107,
      trend: {
        value: "+12% vs período anterior",
        positive: true,
      },
    },
    taxaRealizacao: {
      value: "92%",
      trend: {
        value: "+5% vs período anterior",
        positive: true,
      },
    },
    acoesGeradas: {
      value: 248,
      trend: {
        value: "+18% vs período anterior",
        positive: true,
      },
    },
    taxaConclusao: {
      value: "78%",
      trend: {
        value: "+8% vs período anterior",
        positive: true,
      },
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Total de Reuniões"
        value={kpiData.totalReunioes.value}
        icon={<Calendar className="h-6 w-6 text-blue-600" />}
        trend={kpiData.totalReunioes.trend}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />

      <KpiCard
        title="Taxa de Realização"
        value={kpiData.taxaRealizacao.value}
        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
        trend={kpiData.taxaRealizacao.trend}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />

      <KpiCard
        title="Ações Geradas"
        value={kpiData.acoesGeradas.value}
        icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
        trend={kpiData.acoesGeradas.trend}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
      />

      <KpiCard
        title="Taxa de Conclusão"
        value={kpiData.taxaConclusao.value}
        icon={<Clock8 className="h-6 w-6 text-indigo-600" />}
        trend={kpiData.taxaConclusao.trend}
        iconBgColor="bg-indigo-100"
        iconColor="text-indigo-600"
      />
    </div>
  )
}
