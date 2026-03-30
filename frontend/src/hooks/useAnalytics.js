import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to manage business-specific analytics from the frontend
 * Includes logic for timeframe switching and data formatting
 */
export const useAnalytics = (businessId) => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [range, setRange] = useState('30d');

    const fetchAnalytics = async () => {
        if (!businessId || !user) return;
        
        try {
            setLoading(true);
            const { data: res } = await API.get(`/analytics?id=${businessId}&range=${range}`);
            if (res.success) {
                setData(res.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sync with analytics engine');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [businessId, range, user]);

    // Format data specifically for Recharts or similar chart libraries
    const getChartData = () => {
        if (!data || !data.charts) return [];
        return data.charts.viewTrends.map(item => ({
            name: new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            views: item.count
        }));
    };

    const getLeadData = () => {
        if (!data || !data.charts) return [];
        return data.charts.leadTrends;
    };

    return {
        analytics: data,
        loading,
        error,
        range,
        setRange,
        chartData: getChartData(),
        leadData: getLeadData(),
        refresh: fetchAnalytics
    };
};
