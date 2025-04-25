// Consulta para el panel de usuarios
export default `
SELECT 
  time_column as time,
  count(distinct user_id) as value,
  'active_users' as metric
FROM 
  user_sessions
WHERE
  $timeFilter
  AND activity_type IN ($activityTypes)
GROUP BY 
  time_bucket('1h', time_column)
ORDER BY 
  time
`;