<style scoped>
.filter-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 20px;
}

.filter-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2a1b3d;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section label {
  display: block;
  font-weight: 600;
  color: #5e2c8a;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.date-range {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.date-input {
  flex: 1;
}

.date-input label {
  font-size: 0.8rem;
  color: #67748e;
  margin-bottom: 5px;
}

input[type="date"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d2d6da;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

input[type="date"]:focus {
  border-color: #5e2c8a;
  outline: none;
  box-shadow: 0 0 0 3px rgba(94, 44, 138, 0.15);
}

select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d2d6da;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: white;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235e2c8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
}

select:focus {
  border-color: #5e2c8a;
  outline: none;
  box-shadow: 0 0 0 3px rgba(94, 44, 138, 0.15);
}

.checkbox-group {
  margin-top: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  accent-color: #5e2c8a;
  cursor: pointer;
}

.checkbox-item label {
  font-weight: normal;
  margin-bottom: 0;
  font-size: 0.9rem;
  color: #67748e;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.apply-btn, .reset-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.apply-btn {
  background-color: #5e2c8a;
  color: white;
  flex: 1;
}

.apply-btn:hover {
  background-color: #4a2370;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(94, 44, 138, 0.3);
}

.reset-btn {
  background-color: transparent;
  color: #67748e;
  border: 1px solid #d2d6da;
}

.reset-btn:hover {
  background-color: #f8f9fa;
  color: #344767;
}
</style>