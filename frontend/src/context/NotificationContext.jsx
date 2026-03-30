import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data } = await API.get('/notifications');
            if (data.success) {
                setNotifications(data.data);
                setUnreadCount(data.data.filter(n => !n.is_read).length);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const { data } = await API.get('/notifications?action=count');
            if (data.success) {
                setUnreadCount(data.data.count);
            }
        } catch (err) {
            console.error('Failed to fetch notification count', err);
        }
    };

    const markAsRead = async (id = null) => {
        try {
            const url = id ? `/notifications?action=read&id=${id}` : '/notifications?action=read';
            const { data } = await API.put(url);
            if (data.success) {
                if (id) {
                    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
                    setUnreadCount(prev => Math.max(0, prev - 1));
                } else {
                    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
                    setUnreadCount(0);
                }
            }
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const { data } = await API.delete(`/notifications?id=${id}`);
            if (data.success) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                setUnreadCount(prev => notifications.find(n => n.id === id && !n.is_read) ? prev - 1 : prev);
            }
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchUnreadCount, 60000); // Check count every minute
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
