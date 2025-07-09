from email_validator import validate_email, EmailNotValidError
import dns.resolver

def is_valid_syntax(email):
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False

def has_mx_record(domain):
    try:
        return bool(dns.resolver.resolve(domain, 'MX'))
    except:
        return False

def process_emails(email_list):
    seen = set()
    results = []
    for email in email_list:
        email = email.strip().lower()
        if email in seen or not email:
            continue
        seen.add(email)
        syntax = is_valid_syntax(email)
        domain = email.split('@')[-1] if syntax else None
        mx = has_mx_record(domain) if domain else False
        results.append({
            "email": email,
            "valid_syntax": syntax,
            "mx_record": mx,
            "domain": domain
        })
    return results
def is_m365_domain(domain):
    try:
        answers = dns.resolver.resolve(domain, 'MX')
        for rdata in answers:
            if 'mail.protection.outlook.com' in str(rdata.exchange):
                return True
    except:
        return False
    return False
