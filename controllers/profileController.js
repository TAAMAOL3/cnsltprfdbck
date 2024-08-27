const db = require('../config/db'); // Import der Datenbankkonfiguration

// Controller to get the profile data of a user
exports.getProfile = (req, res) => {
  const userId = req.params.id;
  const currentYear = new Date().getFullYear();

  // Abfrage, um den Benutzernamen und das Profilbild zusätzlich zu den Feedback-Daten zu erhalten
  const userProfileQuery = `
    SELECT *
    FROM t_users 
    WHERE usersID = ?
  `;

  db.query(userProfileQuery, [userId], (error, userResults) => {
    if (error) {
      return res.status(500).json({ message: 'Error fetching user profile data', error });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResults[0]; // Hier haben wir die Benutzerdaten

    const currentReceivedFeedbackQuery = `
      SELECT COUNT(customerFdbckID) AS currentReceivedFeedback
      FROM t_customerfdbck
      WHERE usersFK = ? 
        AND customerFdbckReceived BETWEEN '${currentYear}-01-01' AND '${currentYear}-12-31'
        AND customerFdbckAnswered = 1
    `;

    db.query(currentReceivedFeedbackQuery, [userId], (error, currentReceivedFeedbackResults) => {
      if (error) {
        return res.status(500).json({ message: 'Error fetching currentReceivedFeedback', error });
      }

      const currentRequestedFeedbackQuery = `
        SELECT COUNT(customerFdbckID) AS currentRequestedFeedback
        FROM t_customerfdbck
        WHERE usersFK = ? 
          AND customerFdbckSend BETWEEN '${currentYear}-01-01' AND '${currentYear}-12-31'
          AND customerFdbckAnswered = 0
      `;

      db.query(currentRequestedFeedbackQuery, [userId], (error, currentRequestedFeedbackResults) => {
        if (error) {
          return res.status(500).json({ message: 'Error fetching currentRequestedFeedback', error });
        }

        const currentUploadedFeedbackQuery = `
          SELECT COUNT(variousfdbckID) AS currentUploadedFeedback
          FROM t_variousfdbck
          WHERE usersFK = ?
            AND variousFdbckReceived BETWEEN '${currentYear}-01-01' AND '${currentYear}-12-31'
        `;

        db.query(currentUploadedFeedbackQuery, [userId], (error, currentUploadedFeedbackResults) => {
          if (error) {
            return res.status(500).json({ message: 'Error fetching currentUploadedFeedback', error });
          }

          const totalReceivedFeedbackQuery = `
            SELECT COUNT(customerFdbckID) AS totalReceivedFeedback
            FROM t_customerfdbck
            WHERE usersFK = ? 
              AND customerFdbckAnswered = 1
          `;

          db.query(totalReceivedFeedbackQuery, [userId], (error, totalReceivedFeedbackResults) => {
            if (error) {
              return res.status(500).json({ message: 'Error fetching totalReceivedFeedback', error });
            }

            const totalRequestedFeedbackQuery = `
              SELECT COUNT(customerFdbckID) AS totalRequestedFeedback
              FROM t_customerfdbck
              WHERE usersFK = ? 
                AND customerFdbckAnswered = 0
            `;

            db.query(totalRequestedFeedbackQuery, [userId], (error, totalRequestedFeedbackResults) => {
              if (error) {
                return res.status(500).json({ message: 'Error fetching totalRequestedFeedback', error });
              }

              const totalUploadedFeedbackQuery = `
                SELECT COUNT(variousfdbckID) AS totalUploadedFeedback
                FROM t_variousfdbck
                WHERE usersFK = ?
              `;

              db.query(totalUploadedFeedbackQuery, [userId], (error, totalUploadedFeedbackResults) => {
                if (error) {
                  return res.status(500).json({ message: 'Error fetching totalUploadedFeedback', error });
                }

                const currentAvgRatingQuery = `
                  SELECT AVG(rating) AS currentAvgRating
                  FROM t_customerfdbck
                  WHERE usersFK = ?
                    AND customerFdbckAnswered = 1
                    AND customerFdbckReceived BETWEEN '${currentYear}-01-01' AND '${currentYear}-12-31'
                `;

                db.query(currentAvgRatingQuery, [userId], (error, currentAvgRatingResults) => {
                  if (error) {
                    return res.status(500).json({ message: 'Error fetching currentAvgRating', error });
                  }

                  const totalAvgRatingQuery = `
                    SELECT AVG(rating) AS totalAvgRating
                    FROM t_customerfdbck
                    WHERE usersFK = ?
                      AND customerFdbckAnswered = 1
                  `;

                  db.query(totalAvgRatingQuery, [userId], (error, totalAvgRatingResults) => {
                    if (error) {
                      return res.status(500).json({ message: 'Error fetching totalAvgRating', error });
                    }

                    // Erfolgreiche Rückgabe der Profildaten
                    res.status(200).json({
                      fullname: `${user.usersVorname} ${user.usersNachname}`, // Benutzerdaten jetzt korrekt
                      profilePicture: user.profilePicture, // Benutzerprofilbild
                      currentReceivedFeedback: currentReceivedFeedbackResults[0].currentReceivedFeedback,
                      currentRequestedFeedback: currentRequestedFeedbackResults[0].currentRequestedFeedback,
                      currentUploadedFeedback: currentUploadedFeedbackResults[0].currentUploadedFeedback,
                      totalReceivedFeedback: totalReceivedFeedbackResults[0].totalReceivedFeedback,
                      totalRequestedFeedback: totalRequestedFeedbackResults[0].totalRequestedFeedback,
                      totalUploadedFeedback: totalUploadedFeedbackResults[0].totalUploadedFeedback,
                      currentAvgRating: currentAvgRatingResults[0].currentAvgRating,
                      totalAvgRating: totalAvgRatingResults[0].totalAvgRating,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

exports.updateProfile = (req, res) => {
  // Update user profile logic here
};
