# Toxic Comment Classification Project

A Django web application for classifying user comments across multiple toxicity labels:

- toxic
- severe toxic
- obscene
- threat
- insult
- identity hate

The app includes login and registration screens, a dashboard, a prediction API, and a training script that builds a TF-IDF + Logistic Regression multi-output classifier from the training dataset.

### Demo Credentials
You can use these demo login details to quickly start testing the application without registration:
Demo: [https://toxic-comment-classification-chi.vercel.app/](https://toxic-comment-classification-nine.vercel.app/login/?next=/)
| Email | Password | Role |
|-------|----------|------|
| `admin@toxic.com` | `admin123` | Administrator |
| `user1@toxic.com` | `user123` | Regular User |
| `user2@toxic.com` | `user123` | Regular User |

These demo accounts provide full access to all features including:
- Login and dashboard access
- Comment toxicity prediction
- Model training
- View analytics and visualizations

## Project Structure

```text
toxic_comment_project/
|-- classifier/                  # Django app, templates, static files, trained model files
|-- modelTraining/               # Dataset and model training script
|-- toxic_comment_project/       # Django project settings and URLs
|-- manage.py
|-- requirements.txt
`-- README.md
```

  
## Setup

1. Create and activate a virtual environment.

```bash
python -m venv .venv
.venv\Scripts\activate
```

2. Install dependencies.

```bash
pip install -r requirements.txt
```

3. Create a local environment file.

```bash
copy .env.example .env
```

4. Run database migrations.

```bash
python manage.py migrate
```

5. Start the Django development server.

```bash
python manage.py runserver
```

Open http://127.0.0.1:8000/ in your browser.

## Model Training

The repository includes trained model artifacts in `classifier/model.pkl` and `classifier/vectorizer.pkl`.

To retrain the model from `modelTraining/train.csv`, run:

```bash
python modelTraining/train_model.py
```

The script saves updated `model.pkl` and `vectorizer.pkl` files into the `classifier/` directory, where the Django app loads them.

## Environment Variables

The Django settings read these optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Development-only fallback | Secret key used by Django |
| `DJANGO_DEBUG` | `True` | Enables or disables debug mode |
| `DJANGO_ALLOWED_HOSTS` | `127.0.0.1,localhost` | Comma-separated host allowlist |

For production, set a strong `DJANGO_SECRET_KEY`, set `DJANGO_DEBUG=False`, and configure `DJANGO_ALLOWED_HOSTS` for your deployed domain.

## Notes for GitHub

- Python cache files, local databases, virtual environments, and local `.env` files are ignored by `.gitignore`.
- Keep large or sensitive datasets out of Git unless they are intended to be public.
- Do not commit production secrets.
