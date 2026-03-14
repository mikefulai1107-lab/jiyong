// Import necessary Firebase functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Create a memo
exports.createMemo = functions.https.onRequest(async (req, res) => {
    const { title, content } = req.body;
    const newMemo = { title, content, createdAt: admin.firestore.FieldValue.serverTimestamp() };

    try {
        const memoRef = await db.collection('memos').add(newMemo);
        res.status(201).send({ id: memoRef.id, ...newMemo });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read memos
exports.getMemos = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await db.collection('memos').get();
        const memos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(memos);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a memo
exports.updateMemo = functions.https.onRequest(async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        await db.collection('memos').doc(id).update({ title, content });
        res.status(200).send({ id, title, content });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a memo
exports.deleteMemo = functions.https.onRequest(async (req, res) => {
    const { id } = req.params;

    try {
        await db.collection('memos').doc(id).delete();
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});
