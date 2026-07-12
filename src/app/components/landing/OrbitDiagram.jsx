export function OrbitDiagram() {
  return (
<svg
  className="relative block h-auto w-full overflow-visible"
  viewBox="0 0 480 480"
  role="img"
  aria-label="Diagram of four tracked assets in different lifecycle states orbiting the OrbitOps core"
>
  <defs>
    <radialGradient
      id="coreGlow"
      cx="38%"
      cy="32%"
      r="75%"
    >
      <stop offset="0%" stopColor="#1B2338" />
      <stop offset="100%" stopColor="#0B0F1A" />
    </radialGradient>

    <linearGradient
      id="sweepGrad"
      x1="0"
      y1="1"
      x2="0"
      y2="0"
    >
      <stop
        offset="0%"
        stopColor="#4FD1E8"
        stopOpacity="0"
      />

      <stop
        offset="100%"
        stopColor="#4FD1E8"
        stopOpacity="0.16"
      />
    </linearGradient>
  </defs>

  <circle
    cx="240"
    cy="240"
    r="80"
    fill="none"
    stroke="rgba(148,168,210,0.14)"
    strokeWidth="1"
  />

  <circle
    cx="240"
    cy="240"
    r="160"
    fill="none"
    stroke="rgba(148,168,210,0.28)"
    strokeWidth="1"
    strokeDasharray="3 6"
  />

  <circle
    cx="240"
    cy="240"
    r="225"
    fill="none"
    stroke="rgba(148,168,210,0.14)"
    strokeWidth="1"
  />

  <g className="radar-sweep">
    <path
      d="M240,240 L240,15 A225,225 0 0,1 335.2,36.1 Z"
      fill="url(#sweepGrad)"
    />
  </g>

  <line
    x1="353.1"
    y1="126.9"
    x2="381.4"
    y2="98.6"
    stroke="rgba(148,168,210,0.28)"
    strokeWidth="1"
  />

  <line
    x1="353.1"
    y1="353.1"
    x2="381.4"
    y2="381.4"
    stroke="rgba(148,168,210,0.28)"
    strokeWidth="1"
  />

  <line
    x1="126.9"
    y1="353.1"
    x2="98.6"
    y2="381.4"
    stroke="rgba(148,168,210,0.28)"
    strokeWidth="1"
  />

  <line
    x1="126.9"
    y1="126.9"
    x2="98.6"
    y2="98.6"
    stroke="rgba(148,168,210,0.28)"
    strokeWidth="1"
  />

  <circle
    className="pulse-node"
    cx="353.1"
    cy="126.9"
    r="5"
    fill="#FFB020"
  />

  <circle
    className="pulse-node pulse-node-two"
    cx="353.1"
    cy="353.1"
    r="5"
    fill="#3DDC97"
  />

  <circle
    className="pulse-node pulse-node-three"
    cx="126.9"
    cy="353.1"
    r="5"
    fill="#FF6B6B"
  />

  <circle
    className="pulse-node pulse-node-four"
    cx="126.9"
    cy="126.9"
    r="5"
    fill="#4FD1E8"
  />

  <circle
    cx="353.1"
    cy="126.9"
    r="5.5"
    fill="#FFB020"
    stroke="#080B14"
    strokeWidth="2"
  />

  <circle
    cx="353.1"
    cy="353.1"
    r="5.5"
    fill="#3DDC97"
    stroke="#080B14"
    strokeWidth="2"
  />

  <circle
    cx="126.9"
    cy="353.1"
    r="5.5"
    fill="#FF6B6B"
    stroke="#080B14"
    strokeWidth="2"
  />

  <circle
    cx="126.9"
    cy="126.9"
    r="5.5"
    fill="#4FD1E8"
    stroke="#080B14"
    strokeWidth="2"
  />

  <circle
    cx="240"
    cy="240"
    r="58"
    fill="url(#coreGlow)"
    stroke="rgba(148,168,210,0.28)"
    strokeWidth="1"
  />

  <text
    x="240"
    y="236"
    textAnchor="middle"
    className="fill-[#4FD1E8] font-mono text-[16px] tracking-[1.5px]"
  >
    ORBITOPS
  </text>

  <text
    x="240"
    y="254"
    textAnchor="middle"
    className="fill-[#4FD1E8] font-mono text-[12px] tracking-[1.5px]"
  >
    CORE
  </text>

  <text
    x="386"
    y="93"
    textAnchor="start"
    className="fill-[#E9EDF6] font-mono text-[11.5px]"
  >
    ORB-0114
  </text>

  <text
    x="386"
    y="106"
    textAnchor="start"
    className="fill-[#586180] font-mono text-[9.5px]"
  >
    allocated
  </text>

  <text
    x="386"
    y="392"
    textAnchor="start"
    className="fill-[#E9EDF6] font-mono text-[11.5px]"
  >
    ORB-0021
  </text>

  <text
    x="386"
    y="405"
    textAnchor="start"
    className="fill-[#586180] font-mono text-[9.5px]"
  >
    available
  </text>

  <text
    x="94"
    y="392"
    textAnchor="end"
    className="fill-[#E9EDF6] font-mono text-[11.5px]"
  >
    ORB-0077
  </text>

  <text
    x="94"
    y="405"
    textAnchor="end"
    className="fill-[#586180] font-mono text-[9.5px]"
  >
    maintenance
  </text>

  <text
    x="94"
    y="93"
    textAnchor="end"
    className="fill-[#E9EDF6] font-mono text-[11.5px]"
  >
    ROOM-B2
  </text>

  <text
    x="94"
    y="106"
    textAnchor="end"
    className="fill-[#586180] font-mono text-[9.5px]"
  >
    reserved
  </text>
</svg>
  );
}
