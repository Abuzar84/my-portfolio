from flask import Flask, request, jsonify, send_file
import io
import json
import pdfplumber
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

app = Flask(__name__)

@app.route("/api/process-pdf", methods=["POST"])
def process_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "File must be a PDF"}), 400
    
    try:
        pdf_bytes = file.read()
        extracted_words = []
        
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page_num, page in enumerate(pdf.pages):
                # Extract words with their bounding boxes
                words = page.extract_words(
                    x_tolerance=3, 
                    y_tolerance=3, 
                    keep_blank_chars=False, 
                    use_text_flow=True
                )
                
                for i, word in enumerate(words):
                    # word dict: {'text': '...', 'x0': ..., 'top': ..., 'x1': ..., 'bottom': ..., 'upright': ...}
                    extracted_words.append({
                        "id": f"orig-{page_num}-{i}",
                        "page": page_num + 1,
                        "text": word['text'],
                        "x": float(word['x0']),
                        "y": float(word['top']),
                        "w": float(word['x1'] - word['x0']),
                        "h": float(word['bottom'] - word['top']),
                        "originalText": word['text']
                    })
        
        return jsonify({"words": extracted_words}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate-pdf", methods=["POST"])
def generate_pdf():
    if 'file' not in request.files or 'edits' not in request.form:
        return jsonify({"error": "Missing file or edits"}), 400
    
    file = request.files['file']
    edits = json.loads(request.form['edits'])
    
    try:
        # Read original PDF
        pdf_bytes = file.read()
        existing_pdf = PdfReader(io.BytesIO(pdf_bytes))
        output = PdfWriter()
        
        # Group edits by page
        edits_by_page = {}
        for edit in edits:
            p = edit['page']
            if p not in edits_by_page:
                edits_by_page[p] = []
            edits_by_page[p].append(edit)
            
        for i in range(len(existing_pdf.pages)):
            page_num = i + 1
            page = existing_pdf.pages[i]
            
            if page_num in edits_by_page:
                # Get page dimensions
                width = float(page.mediabox.width)
                height = float(page.mediabox.height)
                
                # Create overlay
                packet = io.BytesIO()
                can = canvas.Canvas(packet, pagesize=(width, height))
                
                for edit in edits_by_page[page_num]:
                    # 1. Redact the original word (draw white rectangle)
                    x = edit['x']
                    # y in PDF/ReportLab is from bottom
                    y = height - (edit['y'] + edit['h'])
                    w = edit['w']
                    h = edit['h']
                    
                    can.setFillColor("white")
                    can.setStrokeColor("white")
                    can.rect(x, y, w, h, fill=1, stroke=1)
                    
                    # 2. Draw the new text
                    # We try to approximate the original font size
                    font_size = h * 0.8 
                    can.setFont("Helvetica", font_size)
                    can.setFillColor("black")
                    # ReportLab drawString uses baseline
                    can.drawString(x, y + (h * 0.2), edit['text'])
                
                can.save()
                packet.seek(0)
                
                # Merge overlay with page
                overlay_reader = PdfReader(packet)
                overlay_page = overlay_reader.pages[0]
                page.merge_page(overlay_page)
                
            output.add_page(page)
            
        # Write output to buffer
        final_buffer = io.BytesIO()
        output.write(final_buffer)
        final_buffer.seek(0)
        
        return send_file(
            final_buffer,
            as_attachment=True,
            download_name="edited.pdf",
            mimetype="application/pdf"
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5328, debug=True)
