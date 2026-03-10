import csv
from numbers_parser import Document
import re

doc = Document('DOC WEB ANTIGRABITY.xlsx - Mediciones.numbers')
sheet = doc.sheets[0]
table = sheet.tables[0]
rows = table.iter_rows(values_only=True)

with open('atletas_importar.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    for i, row in enumerate(rows):
        r = list(row)
        
        # Header processing
        if i == 0:
            if r[0] is None: r[0] = 'Nombre'
            if r[1] is None: r[1] = 'Email'
            r = ["" if x is None else str(x) for x in r]
            writer.writerow(r)
            continue
            
        r = ["" if x is None else str(x) for x in r]
        
        # Skip empty rows
        if not any(r): continue
        
        nombre = r[0].strip()
        email = r[1].strip()
        
        # If email is empty but we have a name, generate a dummy one
        if not email and nombre:
            # Clean name for email
            clean_name = re.sub(r'[^a-zA-Z0-9]', '', nombre.lower())
            email = f"{clean_name}@piloto.coachleon.com"
            r[1] = email
            
        # Only write rows that at least have a name or email
        if nombre or email:
            writer.writerow(r)

print("Exito! Archivo guardado con correos autogenerados como atletas_importar.csv")
