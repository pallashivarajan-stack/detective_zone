import sys
import os

# Add backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.admin import Admin
from app.models.case import Case, CaseSection, Evidence, CaseVideo, CaseGalleryImage, CaseNote, Clue, CasePageContent
from app.models.product import Product, ProductImage
from app.models.kit import CaseKit, KitImage, SignatureEvidence
from app.models.order import Order, OrderItem, OrderEvent, Payment
from app.models.contact import ContactMessage
from app.models.media import MediaFile
from app.models.setting import SiteSetting
from app.models.audit_log import AuditLog
from datetime import datetime, timedelta

def master_seed():
    print("==================================================")
    print("--- Starting Master Database Seeding on MySQL ---")
    print("==================================================")
    
    # 0. Ensure all tables exist in MySQL
    Base.metadata.create_all(bind=engine)
    
    # Auto-migrate payments table columns if needed
    from sqlalchemy import text
    with engine.connect() as conn:
        cols_to_add = [
            ("merchant_transaction_id", "VARCHAR(100) NULL"),
            ("provider_transaction_id", "VARCHAR(100) NULL"),
            ("upi_id", "VARCHAR(100) NULL"),
            ("qr_payload", "TEXT NULL"),
            ("payment_url", "VARCHAR(500) NULL"),
            ("raw_response", "TEXT NULL"),
            ("verified_at", "DATETIME NULL"),
        ]
        for col_name, col_type in cols_to_add:
            try:
                conn.execute(text(f"ALTER TABLE payments ADD COLUMN {col_name} {col_type};"))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()

    try:
        # 1. ADMIN USER
        admin_email = "admin@detectiveszone.co"
        admin = db.query(Admin).filter((Admin.email == admin_email) | (Admin.email == "admin@detectivezone.co")).first()
        if not admin:
            admin = Admin(
                email=admin_email,
                username="admin",
                full_name="Lead Detective Investigator",
                hashed_password=get_password_hash("detective2026"),
                role="superadmin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print(f"[OK] Admin Created: {admin_email} (Passcode: detective2026)")
        else:
            admin.email = admin_email
            admin.hashed_password = get_password_hash("detective2026")
            db.commit()
            print(f"[OK] Admin Verified: {admin_email}")

        # 2. SEED ALL 6 CASES (Using Official AWS S3 URLs)
        cases_master = [
            {
                "case_number": "001",
                "slug": "001",
                "title": "The Last Voicemail",
                "subtitle": "A successful businessman found dead in his study",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png",
                "hero_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png",
                "hero_video": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4",
                "tagline": "Some voices never truly fade into the background.",
                "intro_text": "A successful businessman found dead in his study. No forced entry. No clear motive. Just a voicemail… and a lot of questions.",
                "status": "UNSOLVED",
                "difficulty": "HARD",
                "estimated_duration": "3–5 HOURS",
                "rating": 5.0,
                "short_description": "A successful businessman found dead in his study. No forced entry. Just a voicemail and a lot of questions.",
                "shipping_fee": 80.0,
                "featured": True,
                "is_published": True,
                "display_order": 1,
            },
            {
                "case_number": "002",
                "slug": "002",
                "title": "The Silent Witness",
                "subtitle": "A reclusive writer found dead in a locked room",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-witness.png",
                "hero_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-witness.png",
                "hero_video": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4",
                "tagline": "The witness that never spoke... but saw everything.",
                "intro_text": "A reclusive writer found dead in a locked room. The pages of the final manuscript hold the key to a truth buried in silence.",
                "status": "UNSOLVED",
                "difficulty": "HARD",
                "estimated_duration": "3–6 HOURS",
                "rating": 4.9,
                "short_description": "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
                "featured": True,
                "is_published": True,
                "display_order": 2,
            },
            {
                "case_number": "003",
                "slug": "003",
                "title": "Blood in the Letter",
                "subtitle": "A threatening letter. A missing girl. A trail of blood.",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-letter.png",
                "hero_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-letter.png",
                "hero_video": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4",
                "tagline": "The shadows are speaking.",
                "intro_text": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "status": "COMING SOON",
                "difficulty": "MEDIUM",
                "estimated_duration": "4–5 HOURS",
                "rating": 4.8,
                "short_description": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "featured": False,
                "is_published": True,
                "display_order": 3,
            },
            {
                "case_number": "004",
                "slug": "004",
                "title": "The Vanished One",
                "subtitle": "A disappearance that made no noise at all",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-heir.png",
                "hero_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-heir.png",
                "hero_video": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4",
                "tagline": "Some people leave behind clues. Others erase their footsteps.",
                "intro_text": "A wealthy heiress vanished from a private island. Her personal diary has pages torn from the exact date she disappeared.",
                "status": "COMING SOON",
                "difficulty": "HARD",
                "estimated_duration": "5–6 HOURS",
                "rating": 4.9,
                "short_description": "A wealthy heiress vanished from a private island. Her personal diary has pages torn.",
                "featured": False,
                "is_published": True,
                "display_order": 4,
            },
            {
                "case_number": "005",
                "slug": "005",
                "title": "The Final Experiment",
                "subtitle": "A lab explosion. A dead researcher. A missing breakthrough.",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-experiment.png",
                "hero_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-experiment.png",
                "hero_video": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4",
                "tagline": "Science answers questions. This case only creates more.",
                "intro_text": "An advanced pharmaceutical facility detonated at midnight. The lead biochemist was found inside the vault with an empty syringe.",
                "status": "COMING SOON",
                "difficulty": "EXPERT",
                "estimated_duration": "4–6 HOURS",
                "rating": 5.0,
                "short_description": "An advanced pharmaceutical facility detonated at midnight. The lead biochemist was found inside the vault.",
                "featured": False,
                "is_published": True,
                "display_order": 5,
            },
            {
                "case_number": "006",
                "slug": "006",
                "title": "Shadows of Betrayal",
                "subtitle": "A man caught between loyalty and truth",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-betrayal.png",
                "hero_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-betrayal.png",
                "hero_video": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4",
                "tagline": "Trust no one. Not even your own instincts.",
                "intro_text": "A syndicate informant was eliminated minutes before handing over the ledger. The only witness was his handler.",
                "status": "COMING SOON",
                "difficulty": "EXPERT",
                "estimated_duration": "6–8 HOURS",
                "rating": 4.9,
                "short_description": "A syndicate informant was eliminated minutes before handing over the ledger. One choice changed everything.",
                "featured": False,
                "is_published": True,
                "display_order": 6,
            }
        ]

        saved_cases = {}
        for c in cases_master:
            existing = db.query(Case).filter((Case.slug == c["slug"]) | (Case.case_number == c["case_number"])).first()
            if not existing:
                existing = Case(**c)
                db.add(existing)
                db.commit()
                db.refresh(existing)
            else:
                for k, v in c.items():
                    setattr(existing, k, v)
                db.commit()
            saved_cases[existing.case_number] = existing
            print(f"[OK] Case #{existing.case_number} ready: {existing.title}")

        # 3. SEED CASE PAGE CONTENT FOR ALL 6 CASES (Using S3 URLs)
        s3_corkboard = "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg"
        s3_video = "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4"
        
        page_contents_master = {
            "001": {
                "hero_video_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/Untitled+design+(6).mp4",
                "hero_subtitle": "A successful businessman found dead in his study. No forced entry. No clear motive. Just a voicemail… and a lot of questions.",
                "hero_badge_text": "Case File 001",
                "evidence_wall_bg_url": s3_corkboard,
                "case_type": "Homicide",
                "date_of_incident": "15 July 2027",
                "location": "Varma Residence",
                "quote_text": "The voicemail wasn't a confession. It was a warning.",
                "quote_author": "Detective Varma · Lead Investigator",
                "evidence_pins": [
                    {"id": "vm", "x": 14, "y": 22, "label": "Voicemail", "note": "3:47 AM. \"It's already done. Don't look for me.\"", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-01.jpg", "links": [[0, 1]]},
                    {"id": "card", "x": 45, "y": 24, "label": "Business Card", "note": "Found under the desk. Dated the night before.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-02.jpg", "links": [[1, 2]]},
                    {"id": "receipt", "x": 78, "y": 24, "label": "Receipt", "note": "Dinner for two. Not his wife's handwriting.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-03.jpg", "links": []},
                    {"id": "key", "x": 16, "y": 68, "label": "Door Key", "note": "Unmatched to any lock in the house.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-04.jpg", "links": [[3, 4]]},
                    {"id": "note", "x": 48, "y": 68, "label": "Blackmail Note", "note": "Torn paper. Threatens exposure of offshore accounts.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-05.jpg", "links": [[4, 5]]},
                    {"id": "report", "x": 80, "y": 68, "label": "Forensic Report", "note": "Traces of digitalis found in the whiskey glass.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-06.jpg", "links": []}
                ],
                "investigation_modules": [
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/crime_scene.jpeg", "heading": "Crime Scene", "body": "We provide a secure Drive link inside the kit containing full crime scene video files and authentic audio recordings to explore the scene.", "pct": 75},
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/autospy.jpeg", "heading": "Autopsy Report", "body": "We provide official sealed coroner reports, toxicological blood panels, and trauma anatomical diagrams to establish time and cause of death.", "pct": 60},
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/witness.jpeg", "heading": "Witness Statements", "body": "We provide verbatim police interrogation transcripts, signed eyewitness affidavits, and suspect alibi logs to detect lies and contradictions.", "pct": 45},
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/digital+evidence.jpeg", "heading": "Digital Evidence", "body": "We provide extracted suspect phone records, encrypted chat histories, cell tower triangulation logs, and surveillance CCTV footage.", "pct": 30},
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/documents.jpeg", "heading": "Documents", "body": "We provide confidential forensic dossier files, authentic bank statements, search warrants, and original handwritten correspondence.", "pct": 40},
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/evidence.jpeg", "heading": "Evidence Photos", "body": "We provide high-resolution glossy crime scene polaroids, macro fingerprint lifts, ballistics captures, and suspect surveillance photographs.", "pct": 50},
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/tools.jpeg", "heading": "Tools Given", "body": "We provide authentic physical investigative tools including optical inspection magnifiers, fingerprint cards, and forensic loupes inside the kit.", "pct": 35},
                    {"icon": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/detective_notes.jpeg", "heading": "Detective Notes", "body": "We provide official investigator casebook worksheets, suspect motive matrices, and step-by-step procedural deduction logs to crack the case.", "pct": 20}
                ]
            },
            "002": {
                "hero_video_url": s3_video,
                "hero_subtitle": "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
                "hero_badge_text": "Case File 002",
                "evidence_wall_bg_url": s3_corkboard,
                "case_type": "Locked Room Mystery",
                "date_of_incident": "22 June 2027",
                "location": "Morrow House",
                "quote_text": "Every room has a secret. Some take a lifetime to unlock.",
                "quote_author": "Inspector Chen · Senior Examiner",
                "evidence_pins": [
                    {"id": "mss", "x": 14, "y": 20, "label": "Manuscript", "note": "Final chapter rewritten eleven times.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-07.jpg", "links": [[0, 1]]},
                    {"id": "lamp", "x": 44, "y": 14, "label": "Desk Lamp", "note": "Bulb still warm. Nobody in the room.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-08.jpg", "links": [[1, 2]]},
                    {"id": "lock", "x": 72, "y": 30, "label": "Locked Door", "note": "Bolt thrown from the inside.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-09.jpg", "links": []},
                    {"id": "tape", "x": 18, "y": 68, "label": "Interview Tape", "note": "\"Someone was in the hallway at 11:30...\"", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-10.jpg", "links": [[3, 4]]},
                    {"id": "glass", "x": 52, "y": 72, "label": "Broken Glass", "note": "Splinters outside the window, not inside.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-11.jpg", "links": []},
                    {"id": "watch", "x": 80, "y": 65, "label": "Pocket Watch", "note": "Stopped at precisely 11:47 PM.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-12.jpg", "links": []}
                ],
                "investigation_modules": [
                    {"icon": "PersonStanding", "heading": "Crime Scene", "body": "Explore the room", "pct": 80},
                    {"icon": "FileText", "heading": "Autopsy Report", "body": "Medical examination", "pct": 65},
                    {"icon": "MessagesSquare", "heading": "Witness Statements", "body": "Interviews", "pct": 50},
                    {"icon": "Monitor", "heading": "Digital Evidence", "body": "Manuscripts and notes", "pct": 40},
                    {"icon": "Folder", "heading": "Documents", "body": "Letters and files", "pct": 35},
                    {"icon": "Camera", "heading": "Evidence Photos", "body": "Scene photographs", "pct": 55},
                    {"icon": "Share2", "heading": "Timeline", "body": "Reconstruct evening", "pct": 40},
                    {"icon": "Notebook", "heading": "Detective Notes", "body": "Case deductions", "pct": 25}
                ]
            },
            "003": {
                "hero_video_url": s3_video,
                "hero_subtitle": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "hero_badge_text": "Case File 003",
                "evidence_wall_bg_url": s3_corkboard,
                "case_type": "Abduction & Extortion",
                "date_of_incident": "04 August 2027",
                "location": "North Harbor Docks",
                "quote_text": "The ink was still wet when we found it pinned to her front door.",
                "quote_author": "Detective Roy · Lead Investigator",
                "evidence_pins": [
                    {"id": "letter", "x": 18, "y": 25, "label": "Ransom Letter", "note": "Cut-out newspaper letters. Demands 50L.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-01.jpg", "links": [[0, 1]]},
                    {"id": "cuff", "x": 50, "y": 20, "label": "Bloodied Cufflink", "note": "Custom initials 'R.K.' found near dock 4.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-02.jpg", "links": [[1, 2]]},
                    {"id": "tire", "x": 82, "y": 30, "label": "Tire Tracks", "note": "Van tracks leading towards old warehouse.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-03.jpg", "links": []}
                ],
                "investigation_modules": [
                    {"icon": "PersonStanding", "heading": "Harbor Scene", "body": "Inspect the docks", "pct": 60},
                    {"icon": "FileText", "heading": "Forensic Analysis", "body": "Blood spatter", "pct": 40},
                    {"icon": "MessagesSquare", "heading": "Informant Tips", "body": "Dockworker logs", "pct": 30},
                    {"icon": "Camera", "heading": "Surveillance Stills", "body": "CCTV captures", "pct": 45}
                ]
            },
            "004": {
                "hero_video_url": s3_video,
                "hero_subtitle": "A wealthy heiress vanished from a private island. Her personal diary has pages torn.",
                "hero_badge_text": "Case File 004",
                "evidence_wall_bg_url": s3_corkboard,
                "case_type": "Missing Person",
                "date_of_incident": "12 September 2027",
                "location": "Isla de Sombras",
                "quote_text": "She didn't run away. Someone helped her disappear.",
                "quote_author": "Agent Sterling · Private Detective",
                "evidence_pins": [
                    {"id": "diary", "x": 20, "y": 30, "label": "Torn Diary", "note": "Entry for August 14th cleanly removed.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-04.jpg", "links": [[0, 1]]},
                    {"id": "passport", "x": 60, "y": 25, "label": "Fake Passport", "note": "Issued under alias 'Elena Santos'.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-05.jpg", "links": []}
                ],
                "investigation_modules": [
                    {"icon": "PersonStanding", "heading": "Villa Search", "body": "Inspect bedroom", "pct": 50},
                    {"icon": "Folder", "heading": "Bank Statements", "body": "Offshore transfers", "pct": 35}
                ]
            },
            "005": {
                "hero_video_url": s3_video,
                "hero_subtitle": "An advanced pharmaceutical facility detonated at midnight. The lead biochemist was found inside.",
                "hero_badge_text": "Case File 005",
                "evidence_wall_bg_url": s3_corkboard,
                "case_type": "Corporate Sabotage",
                "date_of_incident": "29 October 2027",
                "location": "Aegis Bio Labs",
                "quote_text": "The formula wasn't destroyed. It was stolen.",
                "quote_author": "Dr. Aris Thorne · Forensic Chemist",
                "evidence_pins": [
                    {"id": "vial", "x": 25, "y": 35, "label": "Empty Vial", "note": "Traces of synthetic neurotoxin Delta-9.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-06.jpg", "links": []},
                    {"id": "badge", "x": 70, "y": 30, "label": "Access Badge", "note": "Used 4 minutes after the blast triggered.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-07.jpg", "links": []}
                ],
                "investigation_modules": [
                    {"icon": "PersonStanding", "heading": "Lab Vault", "body": "Debris analysis", "pct": 40},
                    {"icon": "Monitor", "heading": "Server Logs", "body": "Data exfiltration", "pct": 30}
                ]
            },
            "006": {
                "hero_video_url": s3_video,
                "hero_subtitle": "A syndicate informant was eliminated minutes before handing over the ledger. One choice changed everything.",
                "hero_badge_text": "Case File 006",
                "evidence_wall_bg_url": s3_corkboard,
                "case_type": "Espionage",
                "date_of_incident": "18 November 2027",
                "location": "Underground Metro Line 4",
                "quote_text": "The hardest part of undercover work is knowing who's on your side.",
                "quote_author": "Agent 'Ghost' · Special Operations",
                "evidence_pins": [
                    {"id": "drive", "x": 30, "y": 40, "label": "Encrypted Flash Drive", "note": "256-bit military encryption. 3 attempts left.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-08.jpg", "links": []},
                    {"id": "coin", "x": 75, "y": 35, "label": "Marked Coin", "note": "Syndicate dead-drop identification token.", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-09.jpg", "links": []}
                ],
                "investigation_modules": [
                    {"icon": "PersonStanding", "heading": "Metro Platform", "body": "Ballistics path", "pct": 55},
                    {"icon": "Share2", "heading": "Suspect Network", "body": "Cartel connections", "pct": 45}
                ]
            }
        }

        for c_num, p_content in page_contents_master.items():
            case_obj = saved_cases.get(c_num)
            if case_obj:
                existing_page = db.query(CasePageContent).filter(CasePageContent.case_id == case_obj.id).first()
                if not existing_page:
                    existing_page = CasePageContent(case_id=case_obj.id, **p_content)
                    db.add(existing_page)
                else:
                    for k, v in p_content.items():
                        setattr(existing_page, k, v)
                db.commit()
                print(f"[OK] Case Page Content #{c_num} Synced")

        # 4. SEED DETAILED EVIDENCE & CLUES & SECTIONS FOR ALL 6 CASES
        for c_num, case_obj in saved_cases.items():
            # Seed Section
            if not db.query(CaseSection).filter(CaseSection.case_id == case_obj.id).first():
                db.add(CaseSection(
                    case_id=case_obj.id,
                    section_type="briefing",
                    title="Official Incident Briefing",
                    content_markdown=f"Official precinct investigation briefing for Case #{c_num}: {case_obj.title}. All classified materials must remain sealed within the investigator terminal.",
                    sort_order=1
                ))
            # Seed Evidence items
            if not db.query(Evidence).filter(Evidence.case_id == case_obj.id).first():
                for idx, img_name in enumerate(["e-01.jpg", "e-02.jpg", "e-03.jpg"]):
                    db.add(Evidence(
                        case_id=case_obj.id,
                        title=f"Forensic Artifact #{idx + 1}",
                        type="image",
                        file_url=f"https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/{img_name}",
                        description=f"Evidence artifact recovered from crime scene of {case_obj.title}.",
                        date_recorded=datetime.utcnow().strftime("%d %B %Y, %I:%M %p"),
                        sort_order=idx + 1
                    ))
            # Seed Clues
            if not db.query(Clue).filter(Clue.case_id == case_obj.id).first():
                db.add(Clue(
                    case_id=case_obj.id,
                    title="Primary Cipher Verification",
                    description="Enter the secret keyword recovered from the primary suspect note:",
                    correct_answer="shadow,truth,104,detective",
                    hint="Check the date or room designation in the briefing.",
                    sort_order=1
                ))
            # Seed Case Notes
            if not db.query(CaseNote).filter(CaseNote.case_id == case_obj.id).first():
                db.add(CaseNote(
                    case_id=case_obj.id,
                    title="Initial Detective Observation",
                    body=f"Suspect movements do not align with standard perimeter reports for {case_obj.title}.",
                    highlight_color="blood",
                    is_confidential=True,
                    sort_order=1
                ))
            # Seed Gallery Image
            if not db.query(CaseGalleryImage).filter(CaseGalleryImage.case_id == case_obj.id).first():
                db.add(CaseGalleryImage(
                    case_id=case_obj.id,
                    image_url=case_obj.cover_image or "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png",
                    caption=f"Crime scene perimeter photo — {case_obj.title}",
                    sort_order=1
                ))
            db.commit()
        print("[OK] All Case Sub-resources (Sections, Evidence, Clues, Notes, Gallery) Seeded")

        # 5. SEED CASE KITS (Table: `kits`)
        kits_data = [
            {
                "name": "The Last Voicemail — Hybrid Case Kit",
                "kit_code": "KIT-001",
                "slug": "last-voicemail-kit",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/WhatsApp+Image+2026-09-05+at+10.21.59+PM.jpeg",
                "price": 999.00,
                "sale_price": 899.00,
                "difficulty": "HARD",
                "estimated_time": "3–5 HOURS",
                "availability": "In Stock (10 Left)",
                "description": "Premium rigid evidence box containing 30 physical documents, audio recordings, cipher wheels, and sealed envelopes.",
                "included_items": ["Rigid Collector Locker", "30 Physical Evidence Documents", "Cipher Decoder Disk", "Sealed Autopsy Report", "Suspect Police Dossiers", "Online Terminal Access Code"],
                "sort_order": 1
            },
            {
                "name": "The Silent Witness — Investigation Dossier",
                "kit_code": "KIT-002",
                "slug": "silent-witness-kit",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-witness.png",
                "price": 999.00,
                "sale_price": None,
                "difficulty": "HARD",
                "estimated_time": "3–6 HOURS",
                "availability": "Out of Stock",
                "description": "Full investigation kit with manuscript pages, crime scene blueprints, and locked room forensic evidence.",
                "included_items": ["Writer's Manuscript Pages", "Floor Plan Blueprints", "Police Interrogation Audio", "Fingerprint Lift Cards", "Sealed Final Chapter"],
                "sort_order": 2
            },
            {
                "name": "Blood in the Letter — Physical File",
                "kit_code": "KIT-003",
                "slug": "blood-in-letter-kit",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-letter.png",
                "price": 1199.00,
                "sale_price": 999.00,
                "difficulty": "MEDIUM",
                "estimated_time": "4–5 HOURS",
                "availability": "Out of Stock",
                "description": "Physical case file with blood spatter cards, ransom letters, and surveillance photograph contact sheets.",
                "included_items": ["Physical File Folder", "Ransom Letters & Envelopes", "Blood Spatter Analysis Sheet", "UV Evidence Marker", "Harbor Map"],
                "sort_order": 3
            },
            {
                "name": "Master Detective 4-Case Collector Trunk",
                "kit_code": "KIT-004",
                "slug": "master-collector-trunk",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png",
                "price": 3499.00,
                "sale_price": 2999.00,
                "difficulty": "EXPERT",
                "estimated_time": "15+ HOURS",
                "availability": "Out of Stock",
                "description": "The ultimate detective collector experience: Cases 001 to 004 in a custom black lacquer wooden evidence trunk with metal corners.",
                "included_items": ["Custom Wooden Evidence Trunk", "Cases 001, 002, 003, 004", "Brass Magnifying Glass", "Metal Case Key Replica", "Official Detective Badge", "Numbered Certificate of Authenticity"],
                "sort_order": 4
            }
        ]

        for k in kits_data:
            existing_k = db.query(CaseKit).filter((CaseKit.kit_code == k["kit_code"]) | (CaseKit.slug == k["slug"])).first()
            if not existing_k:
                existing_k = CaseKit(**k)
                db.add(existing_k)
                db.commit()
                db.refresh(existing_k)
            else:
                for key, val in k.items():
                    setattr(existing_k, key, val)
                db.commit()

            # Seed Kit Image
            if not db.query(KitImage).filter(KitImage.kit_id == existing_k.id).first():
                db.add(KitImage(
                    kit_id=existing_k.id,
                    image_url=existing_k.cover_image or "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png",
                    caption=f"{existing_k.name} unboxed contents",
                    sort_order=1
                ))
                db.commit()
            print(f"[OK] Kit #{existing_k.kit_code} Seeded: {existing_k.name}")

        # 6. SEED PRODUCTS (Table: `products` & `product_images`)
        products_master = [
            {
                "name": "The Last Voicemail — Hybrid Case Kit",
                "slug": "p1",
                "price": 999.00,
                "sale_price": None,
                "sku": "DZ-KIT-001",
                "category": "Hybrid Case Kits",
                "stock_quantity": 10,
                "weight": "1.1 kg",
                "dimensions": "28 x 20 x 5 cm",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png",
                "short_description": "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions.",
                "full_description": "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions. Every clue leads deeper into a web of secrets.",
                "availability_status": "available",
                "sort_order": 1
            },
            {
                "name": "The Silent Witness — Investigation Dossier",
                "slug": "p2",
                "price": 999.00,
                "sale_price": None,
                "sku": "DZ-KIT-002",
                "category": "Hybrid Case Kits",
                "stock_quantity": 0,
                "weight": "1.2 kg",
                "dimensions": "30 x 22 x 6 cm",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-witness.png",
                "short_description": "A reclusive writer found dead in a locked room. A witness that never spoke… but saw everything.",
                "full_description": "A reclusive writer found dead in a locked room. The pages of the final manuscript hold the key to a truth buried in silence.",
                "availability_status": "out_of_stock",
                "sort_order": 2
            },
            {
                "name": "Blood in the Letter — Physical File",
                "slug": "p3",
                "price": 1199.00,
                "sale_price": None,
                "sku": "DZ-KIT-003",
                "category": "Physical Files",
                "stock_quantity": 0,
                "weight": "0.9 kg",
                "dimensions": "32 x 24 x 4 cm",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-letter.png",
                "short_description": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "full_description": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "availability_status": "out_of_stock",
                "sort_order": 3
            },
            {
                "name": "The Vanished One — Cold Case Dossier",
                "slug": "p4",
                "price": 999.00,
                "sale_price": None,
                "sku": "DZ-KIT-004",
                "category": "Cold Cases",
                "stock_quantity": 0,
                "weight": "1.0 kg",
                "dimensions": "29 x 21 x 5 cm",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-heir.png",
                "short_description": "A wealthy heiress vanished from a private island. Her personal diary has pages torn.",
                "full_description": "A wealthy heiress vanished from a private island. Her personal diary has pages torn.",
                "availability_status": "out_of_stock",
                "sort_order": 4
            },
            {
                "name": "The Final Experiment — Classified Case",
                "slug": "p5",
                "price": 1299.00,
                "sale_price": None,
                "sku": "DZ-KIT-005",
                "category": "Classified Files",
                "stock_quantity": 0,
                "weight": "1.3 kg",
                "dimensions": "30 x 22 x 6 cm",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-experiment.png",
                "short_description": "An advanced pharmaceutical facility detonated at midnight. The lead biochemist was found inside.",
                "full_description": "An advanced pharmaceutical facility detonated at midnight. The lead biochemist was found inside.",
                "availability_status": "out_of_stock",
                "sort_order": 5
            },
            {
                "name": "Shadows of Betrayal — Premium Collector Kit",
                "slug": "p6",
                "price": 1499.00,
                "sale_price": None,
                "sku": "DZ-KIT-006",
                "category": "Collector Editions",
                "stock_quantity": 0,
                "weight": "1.5 kg",
                "dimensions": "34 x 26 x 7 cm",
                "cover_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-betrayal.png",
                "short_description": "A man caught between loyalty and truth. One choice changed everything.",
                "full_description": "A syndicate informant was eliminated minutes before handing over the ledger.",
                "availability_status": "out_of_stock",
                "sort_order": 6
            }
        ]

        for p in products_master:
            existing_p = db.query(Product).filter((Product.slug == p["slug"]) | (Product.sku == p["sku"])).first()
            if not existing_p:
                existing_p = Product(**p)
                db.add(existing_p)
                db.commit()
                db.refresh(existing_p)
            else:
                for key, val in p.items():
                    setattr(existing_p, key, val)
                db.commit()

            # Seed Product Image
            if not db.query(ProductImage).filter(ProductImage.product_id == existing_p.id).first():
                db.add(ProductImage(
                    product_id=existing_p.id,
                    image_url=existing_p.cover_image or "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png",
                    alt_text=existing_p.name,
                    sort_order=1
                ))
                db.commit()
            print(f"[OK] Product Seeded: {existing_p.name}")

        # 7. SEED SIGNATURE EVIDENCE (Table: `signatures`)
        sig_data = [
            {"label": "Audio Intercept Wiretap", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/audio.png", "description": "High-frequency audio recording captured from harbor surveillance.", "authenticity_note": "Verified Wiretap Master Reel"},
            {"label": "Surveillance Camera Still", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/camera.png", "description": "35mm camera frame timestamped at 11:47 PM.", "authenticity_note": "Forensic Negative Proof"},
            {"label": "Redacted Police Files", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/files.png", "description": "Original precinct incident report with confidential witness details.", "authenticity_note": "Classified Precinct Evidence"},
            {"label": "Encrypted Mobile Device", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/mobile.png", "description": "Recovered burner phone with encrypted SMS records.", "authenticity_note": "Hardware Seizure Proof"},
            {"label": "Cipher Puzzle Disc", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/puzzle.png", "description": "Rotating brass cipher tool used to decrypt victim's diary.", "authenticity_note": "Mechanical Code Tool"},
            {"label": "Stopped Pocket Watch", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/time.png", "description": "Forensic proof of exact timestamp of study breach.", "authenticity_note": "Impact Timestamp Clue"},
            {"label": "Master Evidence Case Box", "image_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/WhatsApp+Image+2026-09-05+at+10.21.59+PM.jpeg", "description": "Custom rigid evidence locker with seal integrity stickers.", "authenticity_note": "Numbered Edition #047"}
        ]
        for s in sig_data:
            existing_s = db.query(SignatureEvidence).filter(SignatureEvidence.label == s["label"]).first()
            if not existing_s:
                db.add(SignatureEvidence(**s))
            else:
                for k, v in s.items():
                    setattr(existing_s, k, v)
        db.commit()
        print("[OK] Signature Evidences Seeded")

        # 8. SEED SAMPLE ORDERS & TRACKING (Table: `orders`, `order_items`, `order_events`, `payments`)
        sample_order = db.query(Order).filter(Order.order_number == "ORD-2026-00101").first()
        if not sample_order:
            sample_order = Order(
                order_number="ORD-2026-00101",
                customer_name="Agent R. Sharma",
                customer_email="sharma.detective@gmail.com",
                customer_phone="+91 98765 43210",
                shipping_address="42 Jubilee Hills, Road No. 36",
                city="Hyderabad",
                state="Telangana",
                postal_code="500033",
                country="India",
                subtotal=999.0,
                discount_amount=0.0,
                tax_amount=0.0,
                shipping_fee=0.0,
                total_amount=999.0,
                currency="INR",
                payment_status="SUCCESS",
                order_status="SHIPPED",
                payment_method="UPI",
                transaction_id="TXN_UPI_994827110",
                paid_at=datetime.utcnow() - timedelta(days=2),
                tracking_number="DZ-EXP-884920IN",
                shipping_carrier="BlueDart Courier",
                expected_delivery_date="24 August 2026",
                payment_success_email_sent=True,
                order_acceptance_email_sent=True,
                email_status="SENT",
                created_at=datetime.utcnow() - timedelta(days=2)
            )
            db.add(sample_order)
            db.commit()
            db.refresh(sample_order)

            # Add Order Item
            first_product = db.query(Product).first()
            db.add(OrderItem(
                order_id=sample_order.id,
                product_id=first_product.id if first_product else None,
                item_title="The Last Voicemail — Hybrid Case Kit",
                sku="DZ-KIT-001",
                quantity=1,
                unit_price=999.0,
                total_price=999.0,
                image_url="https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png"
            ))

            # Add Order Timeline Events
            db.add(OrderEvent(
                order_id=sample_order.id,
                event_type="PAYMENT_RECEIVED",
                previous_status="PENDING_PAYMENT",
                new_status="PAYMENT_CONFIRMED",
                message="UPI payment of ₹999 verified successfully.",
                performed_by="System Gateway",
                created_at=datetime.utcnow() - timedelta(days=2)
            ))
            db.add(OrderEvent(
                order_id=sample_order.id,
                event_type="ORDER_ACCEPTED",
                previous_status="PAYMENT_CONFIRMED",
                new_status="ACCEPTED",
                message="Case file order approved by Dispatch Bureau.",
                performed_by="Admin: admin@detectiveszone.co",
                created_at=datetime.utcnow() - timedelta(days=2, hours=1)
            ))
            db.add(OrderEvent(
                order_id=sample_order.id,
                event_type="STATUS_UPDATED",
                previous_status="ACCEPTED",
                new_status="PACKED",
                message="Case locker packed with wax seal integrity badge.",
                performed_by="Fulfillment Agent",
                created_at=datetime.utcnow() - timedelta(days=1)
            ))
            db.add(OrderEvent(
                order_id=sample_order.id,
                event_type="STATUS_UPDATED",
                previous_status="PACKED",
                new_status="SHIPPED",
                message="Package handed over to BlueDart (Tracking: DZ-EXP-884920IN).",
                performed_by="Logistics Courier",
                created_at=datetime.utcnow() - timedelta(hours=6)
            ))

            # Add Payment Record
            db.add(Payment(
                order_id=sample_order.id,
                provider="PHONEPE",
                payment_method="UPI",
                transaction_id="TXN_UPI_994827110",
                amount=999.0,
                currency="INR",
                status="SUCCESS",
                paid_at=datetime.utcnow() - timedelta(days=2)
            ))
            db.commit()
            print("[OK] Sample Order #ORD-2026-00101 with Full Tracking Seeded")

        # 9. SEED CONTACT MESSAGES (Table: `contact_messages`)
        if db.query(ContactMessage).count() == 0:
            db.add(ContactMessage(
                name="Siddharth Varma",
                email="siddharth.varma@gmail.com",
                subject="Inquiry regarding Case 001 physical kit release date",
                message="Hello Detective Zone team, will the deluxe collector box for Case 001 be available for international shipping to London?",
                status="unread",
                created_at=datetime.utcnow() - timedelta(hours=3)
            ))
            db.add(ContactMessage(
                name="Ananya Iyer",
                email="ananya.iyer@outlook.com",
                subject="Group Mystery Event Booking",
                message="We are planning a mystery birthday party for 12 people. Can we purchase multiple identical case kits for team solving?",
                status="read",
                reply_notes="Replied via email confirming bulk discounts.",
                created_at=datetime.utcnow() - timedelta(days=1)
            ))
            db.commit()
            print("[OK] Sample Contact Inquiries Seeded")

        # 10. SEED MEDIA FILES CATALOG (Table: `media`)
        if db.query(MediaFile).count() == 0:
            media_items = [
                {"filename": "detective-scrub-fast.mp4", "original_name": "detective-scrub-fast.mp4", "file_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4", "file_type": "video", "mime_type": "video/mp4", "folder": "cases", "file_size": 15400000},
                {"filename": "evidence-room.jpg", "original_name": "evidence-room.jpg", "file_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence-room.jpg", "file_type": "image", "mime_type": "image/jpeg", "folder": "evidence", "file_size": 2450000},
                {"filename": "noir-street.jpg", "original_name": "noir-street.jpg", "file_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/noir-street.jpg", "file_type": "image", "mime_type": "image/jpeg", "folder": "general", "file_size": 3100000},
                {"filename": "case-voicemail.png", "original_name": "case-voicemail.png", "file_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png", "file_type": "image", "mime_type": "image/png", "folder": "cases", "file_size": 1800000},
                {"filename": "case-witness.png", "original_name": "case-witness.png", "file_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-witness.png", "file_type": "image", "mime_type": "image/png", "folder": "cases", "file_size": 1950000},
                {"filename": "corkboard.jpg", "original_name": "corkboard.jpg", "file_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg", "file_type": "image", "mime_type": "image/jpeg", "folder": "evidence", "file_size": 2100000}
            ]
            for m in media_items:
                db.add(MediaFile(**m))
            db.commit()
            print("[OK] Media Files Catalog Seeded")

        # 11. SEED COMPLETE SITE SETTINGS (Table: `settings`)
        settings_master = {
            "site_name": "Detective Zone",
            "hero_title": "Detective Zone",
            "hero_subtitle": "An Archive of Unfinished Truths",
            "hero_video_url": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/detective-scrub-fast.mp4",
            "about_heading": "Every shadow has a story",
            "about_text": "Detective Zone is a story-driven investigation experience. Each case is written like a dossier — statements, photographs, timelines — and nothing is handed to you. You read the room, you weigh the lies, you close the file.",
            "about_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/noir-street.jpg",
            "challenge_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence-room.jpg",
            "challenge_discount": "25% OFF",
            "challenge_code": "DZ25-SOLVED",
            "featured_kit_title": "The Last Voicemail",
            "featured_kit_code": "DZ-001",
            "featured_kit_price": "999",
            "featured_kit_image": "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/WhatsApp+Image+2026-09-05+at+10.21.59+PM.jpeg",
            "featured_kit_quote": '"A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth."',
            "featured_kit_duration": "3–4",
            "featured_kit_level": "Expert",
            "contact_email": "files@detectiveszone.co",
            "contact_phone": "+91 63057 29867",
            "office_address": "42 Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033",
            "shipping_flat_rate": "0.00",
            "free_shipping_threshold": "499.00",
            "upi_id": "8885296645@ybl",
            "phonepe_merchant_id": "PGTESTPAYUAT",
            "phonepe_env": "UAT",
        }

        for key, val in settings_master.items():
            existing_s = db.query(SiteSetting).filter(SiteSetting.key == key).first()
            if not existing_s:
                db.add(SiteSetting(key=key, value=val))
            else:
                existing_s.value = val
        db.commit()
        print("[OK] All 20+ Global & Page CMS Settings Synchronized")

        # 12. AUDIT LOG INITIALIZATION (Table: `audit_logs`)
        if db.query(AuditLog).count() == 0:
            db.add(AuditLog(
                admin_id=admin.id,
                admin_username=admin.username,
                action="INITIALIZE",
                target_model="DATABASE",
                target_id="MYSQL_MIGRATION",
                details="Master database initialized on MySQL with complete case dossiers, products, media files, and settings using AWS S3 media bucket.",
                ip_address="127.0.0.1",
                created_at=datetime.utcnow()
            ))
            db.commit()
            print("[OK] Audit Log Initialized")

        print("==================================================")
        print("--- MASTER DATABASE SEEDING COMPLETED (100%) ---")
        print("==================================================")

    except Exception as e:
        db.rollback()
        print(f"Error during master seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    master_seed()
