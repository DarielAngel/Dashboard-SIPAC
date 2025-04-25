// Consulta para el panel de actividades
export default `
SELECT 
  time_column as time,
  activity_count as value,
  activity_type as metric
FROM 
  activities
WHERE
  $timeFilter
GROUP BY 
  activity_type, 
  time_bucket('1h', time_column)
ORDER BY 
  time
`;