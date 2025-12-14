"use client";

import { Shield, Target, Users, Zap, BarChart3, Lock, Globe } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "Real-Time Monitoring",
      description: "Continuous monitoring of DeFi protocol stability metrics with instant alerts and updates.",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Deep insights into protocol health, risk assessment, and stability trends over time.",
    },
    {
      icon: Lock,
      title: "Immune System",
      description: "Advanced threat detection and protection mechanisms to safeguard DeFi ecosystems.",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Lightning-fast data processing and reliable infrastructure for critical monitoring needs.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by the community, for the community. Transparent and decentralized scoring.",
    },
    {
      icon: Globe,
      title: "Multi-Protocol Support",
      description: "Support for major DeFi protocols including Compound, Aave, MakerDAO, and more.",
    },
  ];

  const stats = [
    { label: "Protocols Monitored", value: "24+" },
    { label: "Total Value Tracked", value: "$12.2B" },
    { label: "Active Users", value: "10K+" },
    { label: "Scores Published", value: "1.2K+" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          About StabilityNet
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          A comprehensive platform for monitoring, analyzing, and protecting DeFi protocol stability
          through real-time metrics, risk assessment, and community-driven insights.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="mb-16 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              StabilityNet is dedicated to creating a safer and more transparent DeFi ecosystem. We
              provide real-time stability monitoring, comprehensive risk assessment, and community-driven
              scoring to help users make informed decisions about DeFi protocols. Our platform empowers
              the community to collectively monitor and protect the stability of decentralized finance.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="rounded-full bg-blue-100 p-3 w-fit dark:bg-blue-900/20 mb-4">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              1
            </div>
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">Monitor</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Real-time monitoring of protocol metrics, liquidity, and stability indicators.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              2
            </div>
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">Analyze</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Comprehensive analysis and risk assessment using advanced algorithms and community input.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              3
            </div>
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">Protect</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Early warning system and immune protection mechanisms to safeguard DeFi ecosystems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

