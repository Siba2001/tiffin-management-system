import { useEffect, useState } from 'react';
import { StudentLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { menuService } from '../../services';
import { handleApiError, formatDate, getTodayDate } from '../../utils/helpers';

const StudentMenu = () => {
  const [dailyMenu, setDailyMenu] = useState(null);
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeekly = async () => {
      setLoading(true);
      try {
        const { data } = await menuService.getWeekly(selectedDate);
        setWeeklyMenu(data.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeekly();
  }, [selectedDate]);

  useEffect(() => {
    menuService.getByDate(selectedDate)
      .then((res) => setDailyMenu(res.data.data))
      .catch(() => setDailyMenu(null));
  }, [selectedDate]);

  return (
    <StudentLayout>
      {loading && <LoadingSpinner />}
      <div className="page-header">
        <h4 className="fw-bold mb-1">Menu</h4>
        <p className="text-muted">View daily and weekly tiffin menu</p>
      </div>

      <div className="mb-3">
        <label className="form-label">Select Date</label>
        <input type="date" className="form-control w-auto" value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <div className="card table-card mb-4">
        <div className="card-header bg-white fw-semibold">Daily Menu - {formatDate(selectedDate)}</div>
        <div className="card-body">
          {dailyMenu ? (
            <div className="row">
              <div className="col-md-4"><div className="p-3 bg-light rounded"><h6><i className="bi bi-sunrise me-2"></i>Breakfast</h6><p className="mb-0">{dailyMenu.breakfast || 'Not set'}</p></div></div>
              <div className="col-md-4"><div className="p-3 bg-light rounded"><h6><i className="bi bi-sun me-2"></i>Lunch</h6><p className="mb-0">{dailyMenu.lunch || 'Not set'}</p></div></div>
              <div className="col-md-4"><div className="p-3 bg-light rounded"><h6><i className="bi bi-moon me-2"></i>Dinner</h6><p className="mb-0">{dailyMenu.dinner || 'Not set'}</p></div></div>
            </div>
          ) : <p className="text-muted mb-0">No menu available for this date</p>}
        </div>
      </div>

      <div className="card table-card">
        <div className="card-header bg-white fw-semibold">Weekly Menu</div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr><th>Date</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr></thead>
            <tbody>
              {weeklyMenu.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-muted">No menus for this week</td></tr>
              ) : weeklyMenu.map((m) => (
                <tr key={m.id}>
                  <td>{formatDate(m.menuDate)}</td>
                  <td>{m.breakfast || '-'}</td>
                  <td>{m.lunch || '-'}</td>
                  <td>{m.dinner || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentMenu;
