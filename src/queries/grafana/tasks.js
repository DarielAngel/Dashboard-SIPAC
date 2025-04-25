// Consulta para el panel de tareas
export default `
SELECT 
  time_column as time,
  count(*) as value,
  task_status as metric
FROM 
  tasks
WHERE
  $timeFilter
  AND task_status IN ($taskStatus)
GROUP BY 
  task_status, 
  time_bucket('1d', time_column)
ORDER BY 
  time
`;