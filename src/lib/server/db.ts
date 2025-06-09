import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

const pool = mysql.createPool({
    host: '192.168.56.102',
    user: 'root',
    password: '12345678',
    database: 'event_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
}

export async function findUserByEmail(email: string) {
    const users = await query<any[]>('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
}

export async function createUser(email: string, password: string, name: string) {
    const id = uuidv4();
    await pool.execute(
        'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
        [id, email, password, name]
    );
    return { id, email, name };
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [result] = await pool.execute(
        'INSERT INTO sessions (user_id, expires_at) VALUES (?, ?)',
        [userId, expiresAt]
    );
    return { id: (result as any).insertId, userId, expiresAt };
}

export async function findSessionById(sessionId: string) {
    const sessions = await query<any[]>(
        'SELECT s.*, u.id as user_id, u.email, u.name, u.password, u.created_at, u.updated_at FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > NOW()',
        [sessionId]
    );
    return sessions[0];
}

export async function getAllEvents(userId?: string) {
    if (!userId) {
        return await query<any[]>('SELECT *, created_at as createdAt, updated_at as updatedAt FROM events ORDER BY date DESC');
    }

    return await query<any[]>(
        `SELECT e.*, e.created_at as createdAt, e.updated_at as updatedAt, er.id as registrationId, er.status 
         FROM events e 
         LEFT JOIN event_registrations er ON e.id = er.event_id AND er.user_id = ? 
         ORDER BY e.date DESC`,
        [userId]
    );
}

export async function getEventById(eventId: string) {
    const events = await query<any[]>('SELECT * FROM events WHERE id = ?', [eventId]);
    return events[0];
}

export async function createEvent(event: {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    creatorId: string;
}) {
    const id = uuidv4();
    await pool.execute(
        'INSERT INTO events (id, title, description, date, location, capacity, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, event.title, event.description, event.date, event.location, event.capacity, event.creatorId]
    );
    return { id, ...event };
}

export async function getUserEvents(userId: string) {
    return await query<any[]>(
        'SELECT *, created_at as createdAt, updated_at as updatedAt FROM events WHERE creator_id = ? ORDER BY date DESC',
        [userId]
    );
}

export async function getUserRegisteredEvents(userId: string) {
    return await query<any[]>(
        `SELECT e.*, e.created_at as createdAt, e.updated_at as updatedAt, er.id as registrationId, er.status, er.registered_at 
         FROM events e 
         JOIN event_registrations er ON e.id = er.event_id 
         WHERE er.user_id = ? 
         ORDER BY e.date DESC`,
        [userId]
    );
}

export async function registerForEvent(userId: string, eventId: string) {
    const id = uuidv4();
    await pool.execute(
        'INSERT INTO event_registrations (id, user_id, event_id) VALUES (?, ?, ?)',
        [id, userId, eventId]
    );
    return { id, userId, eventId, status: 'registered' };
}

export async function updateRegistrationStatus(registrationId: string, status: 'registered' | 'checked-in' | 'cancelled') {
    await pool.execute(
        'UPDATE event_registrations SET status = ? WHERE id = ?',
        [status, registrationId]
    );
    return { id: registrationId, status };
}

export async function getEventRegistrations(eventId: string) {
    return await query<any[]>(
        `SELECT er.*, u.name, u.email 
         FROM event_registrations er 
         JOIN users u ON er.user_id = u.id 
         WHERE er.event_id = ? 
         ORDER BY er.registered_at DESC`,
        [eventId]
    );
}

export async function deleteEvent(eventId: string) {
    await query('DELETE FROM events WHERE id = ?', [eventId]);
    return { success: true };
}

export async function isUserRegisteredForEvent(userId: string, eventId: string) {
    const registrations = await query<any[]>(
        'SELECT * FROM event_registrations WHERE user_id = ? AND event_id = ?',
        [userId, eventId]
    );
    return registrations.length > 0;
}

export async function getEventWithCreator(eventId: string) {
    const events = await query<any[]>(
        `SELECT e.*, u.name as creatorName, u.email as creatorEmail 
         FROM events e 
         JOIN users u ON e.creator_id = u.id 
         WHERE e.id = ?`,
        [eventId]
    );
    return events[0];
}

export async function updateEvent(eventId: string, event: {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
}) {
    await pool.execute(
        'UPDATE events SET title = ?, description = ?, date = ?, location = ?, capacity = ? WHERE id = ?',
        [event.title, event.description, event.date, event.location, event.capacity, eventId]
    );
    return { id: eventId, ...event };
} 
