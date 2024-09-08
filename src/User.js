import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import UserFeedback from './UserFeedback';
import UserRequest from './UserRequest';
import UserReceived from './UserReceived';
import Profile from './Profile';
import { translate } from './translateFunction'; // Import the translate function

const User = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for translations
  const [translations, setTranslations] = useState({
    myFeedbacksTitle: '',
    feedbackOverviewDescription: '',
    veryPositive: '',
    positive: '',
    neutral: '',
    negative: '',
    veryNegative: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const myFeedbacksTitle = await translate(180); // "Meine Feedbacks"
      const feedbackOverviewDescription = await translate(181); // "Überblick über erhaltene, offene und selbst erstellte Feedbacks"
      const veryPositive = await translate(182); // "Sehr Positiv"
      const positive = await translate(183); // "Positiv"
      const neutral = await translate(184); // "Neutral"
      const negative = await translate(185); // "Negativ"
      const veryNegative = await translate(186); // "Sehr Negativ"

      setTranslations({
        myFeedbacksTitle,
        feedbackOverviewDescription,
        veryPositive,
        positive,
        neutral,
        negative,
        veryNegative
      });
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect unauthenticated users
    }
  }, [user, navigate]);

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/person_BOLD.svg" alt="User icon" />
          </div>
          <hgroup className="title">
            <h1>{translations.myFeedbacksTitle}</h1>
            <p>{translations.feedbackOverviewDescription}</p>
          </hgroup>
          <div className="feedback-legend">
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/VeryPositive.png" alt={translations.veryPositive} />
              <span>{translations.veryPositive}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Positive.png" alt={translations.positive} />
              <span>{translations.positive}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Unknown.png" alt={translations.neutral} />
              <span>{translations.neutral}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Negative.png" alt={translations.negative} />
              <span>{translations.negative}</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/VeryNegative.png" alt={translations.veryNegative} />
              <span>{translations.veryNegative}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="container mt-5" id="flexcontainer">
        <Profile />

        <UserReceived />

        <UserFeedback />

        <UserRequest />
      </div>
    </div>
  );
};

export default User;
