interface WorkflowEdgeProps {
  id?: string;
  label?: string;
  animated?: boolean;
  color?: string;
}

/**
 * SVG edge/arrow connecting two WorkflowNodes.
 * Usage: place this in an SVG overlay covering the workflow canvas,
 * passing x1/y1/x2/y2 coordinates of the node connector dots.
 */
export function WorkflowEdge({
  id,
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 0,
  label,
  animated = true,
  color = "#6272f5",
}: WorkflowEdgeProps & { x1?: number; y1?: number; x2?: number; y2?: number }) {
  const cx = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  const midX = cx;
  const midY = (y1 + y2) / 2;

  return (
    <g id={id}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.6}
        strokeDasharray={animated ? "6 4" : undefined}
        strokeLinecap="round"
      >
        {animated && (
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
        )}
      </path>
      {/* Arrowhead */}
      <polygon
        points={`${x2},${y2} ${x2 - 5},${y2 - 4} ${x2 - 5},${y2 + 4}`}
        fill={color}
        fillOpacity={0.8}
      />
      {label && (
        <text
          x={midX}
          y={midY - 6}
          textAnchor="middle"
          fill="#9b9dae"
          fontSize={9}
          fontFamily="Inter, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
}
