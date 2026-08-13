from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multioutput import MultiOutputClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
CLASSIFIER_DIR = PROJECT_DIR / 'classifier'

# Load dataset
df = pd.read_csv(BASE_DIR / 'train.csv')

# Clean the text data (you can add more cleaning steps if needed)
df['comment_text'] = df['comment_text'].str.replace(r'[^\w\s]', '', regex=True).str.lower()

# Define features and labels
X = df['comment_text']  # Features: Comment text
y = df[['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']]  # Multi-labels

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Vectorize the text using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train a multi-output classifier with Logistic Regression
model = MultiOutputClassifier(LogisticRegression(max_iter=1000))

# Train the model
model.fit(X_train_vec, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test_vec)

# Evaluate the model (you can use accuracy or any other evaluation metric)
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy}')

# Save the model and vectorizer
pickle.dump(model, open(CLASSIFIER_DIR / 'model.pkl', 'wb'))
pickle.dump(vectorizer, open(CLASSIFIER_DIR / 'vectorizer.pkl', 'wb'))

print("Model and vectorizer saved!")
