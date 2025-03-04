# Woffy AI

Woffy AI is a product of [Onwords](https://onwords.in).

## Environment Configuration
Create a `.env` file in the root directory with the following configuration:

```
# Email settings for newsletter confirmations
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password_or_app_password
EMAIL_FROM=your_email@example.com
```

**Important**: Never commit your actual `.env` file to version control. The `.env.example` file is provided as a template.
