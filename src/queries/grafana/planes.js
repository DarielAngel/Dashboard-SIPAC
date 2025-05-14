// Consulta para el panel de planes
export default `
SELECT 
  time_column as time,
  plan_name,
  plan_status,
  completion_percentage as value
FROM 
  planes
WHERE
  $timeFilter
  AND time_column BETWEEN '$fechaInicio' AND '$fechaFin'
  AND plan_type IN ($planTypes)
ORDER BY 
  time
`;