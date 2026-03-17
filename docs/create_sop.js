const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, LevelFormat } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "005EB8" },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "005EB8" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 } }
    ]
  },
  numbering: {
    config: [{
      reference: "numbers",
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      // Title
      new Paragraph({
        children: [new TextRun({ text: "NHS ICT HR Policy Assistant", bold: true, size: 40, color: "005EB8" })],
        alignment: AlignmentType.CENTER, spacing: { before: 1440, after: 240 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Standard Operating Procedure", size: 32, color: "003087" })],
        alignment: AlignmentType.CENTER, spacing: { after: 240 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "System Startup & Shutdown Guide", size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { after: 1440 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Version: 1.0" })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Author: David Sewoke" })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Date: March 2026" })],
        alignment: AlignmentType.CENTER, spacing: { after: 1440 }
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // STARTING THE SYSTEM
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Starting the System from PC Reboot")] }),
      
      new Paragraph({
        children: [new TextRun({ text: "Prerequisites:", bold: true })],
        spacing: { before: 240, after: 120 }
      }),
      new Paragraph({
        children: [new TextRun("• PC is powered on and logged into Windows 11")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("• User: civil")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("• Hostname: WINDOWS-AAS0LVD")],
        spacing: { after: 360 }
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 1: Open WSL Ubuntu Terminal")] }),
      new Paragraph({
        children: [new TextRun({ text: "Method A (Recommended):", bold: true })],
        spacing: { before: 120, after: 60 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Press Windows Key")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Type 'Ubuntu'")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Click 'Ubuntu' or 'Ubuntu 24.04' application")]
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "\nMethod B (Alternative):", bold: true })],
        spacing: { before: 240, after: 60 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Press Windows Key + X")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Click 'Windows Terminal' or 'Terminal'")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Click dropdown arrow (v) at top")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Select 'Ubuntu 24.04'")]
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "\nYou should see:", italics: true })],
        spacing: { before: 240, after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "civil@WINDOWS-AAS0LVD:~$", font: "Courier New" })],
        spacing: { after: 360 }
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 2: Navigate to Project & Start Backend")] }),
      
      new Paragraph({
        children: [new TextRun({ text: "In the Ubuntu terminal, type these commands EXACTLY:", bold: true })],
        spacing: { before: 120, after: 240 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Command 1: Navigate to backend folder", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "cd ~/nhs-hr-rag/backend", font: "Courier New", size: 22 })],
        spacing: { after: 120 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Command 2: Activate virtual environment", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "source ../venv/bin/activate", font: "Courier New", size: 22 })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "You should see (venv) appear at start of prompt:", italics: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "(venv) civil@WINDOWS-AAS0LVD:~/nhs-hr-rag/backend$", font: "Courier New" })],
        spacing: { after: 240 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Command 3: Start backend server", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "python3 api.py", font: "Courier New", size: 22 })],
        spacing: { after: 240 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "✅ SUCCESS: Wait for this message:", bold: true, color: "00AA00" })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)", font: "Courier New" })],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "⚠️ DO NOT CLOSE THIS TERMINAL! Leave it running.", bold: true, color: "FF6600" })],
        spacing: { after: 360 }
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 3: Open Second Terminal & Start Frontend")] }),
      
      new Paragraph({
        children: [new TextRun({ text: "Option A: New Terminal Tab (Recommended)", bold: true })],
        spacing: { before: 120, after: 60 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Press Ctrl + Shift + T (creates new tab)")]
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "\nOption B: New Terminal Window", bold: true })],
        spacing: { before: 240, after: 60 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Open a new Ubuntu window (repeat Step 1)")]
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "\nIn the NEW terminal, type:", bold: true })],
        spacing: { before: 360, after: 240 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Command 1: Navigate to frontend folder", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "cd ~/nhs-hr-rag/frontend", font: "Courier New", size: 22 })],
        spacing: { after: 240 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Command 2: Start frontend development server", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "npm run dev", font: "Courier New", size: 22 })],
        spacing: { after: 240 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "✅ SUCCESS: Wait for these messages:", bold: true, color: "00AA00" })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "VITE v4.4.0  ready in XXX ms\n  ➜  Local:   http://localhost:3000/", font: "Courier New" })],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "⚠️ DO NOT CLOSE THIS TERMINAL EITHER! Leave both running.", bold: true, color: "FF6600" })],
        spacing: { after: 360 }
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Step 4: Open Web Browser & Access System")] }),
      
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Open Chrome, Edge, or Firefox")],
        spacing: { before: 120 }
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("In address bar, type: http://localhost:3000")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Press Enter")]
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "\n✅ SUCCESS: You should see the NHS ICT HR Policy Assistant welcome screen with:", bold: true, color: "00AA00" })],
        spacing: { before: 360, after: 120 }
      }),
      new Paragraph({
        children: [new TextRun("• NHS logo and blue header")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("• Statistics (85 chunks, 10 policies)")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("• Example questions")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("• Question input box at bottom")],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "🎉 SYSTEM IS NOW RUNNING!", bold: true, size: 28, color: "005EB8" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 480 }
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // STOPPING THE SYSTEM
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Stopping the System")] }),
      
      new Paragraph({
        children: [new TextRun("To properly shut down the system:")],
        spacing: { before: 240, after: 240 }
      }),
      
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Go to Terminal 1 (Backend - the one showing Uvicorn running)")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Press Ctrl + C")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Wait for 'Shutting down' message")]
      }),
      
      new Paragraph({
        children: [new TextRun("")],
        spacing: { after: 240 }
      }),
      
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Go to Terminal 2 (Frontend - the one showing Vite)")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Press Ctrl + C")]
      }),
      
      new Paragraph({
        children: [new TextRun("")],
        spacing: { after: 240 }
      }),
      
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Close both terminal windows")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Close the browser tab")]
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "\n✅ System stopped safely", bold: true, color: "00AA00" })],
        spacing: { before: 360 }
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // TROUBLESHOOTING
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Troubleshooting")] }),
      
      new Paragraph({
        children: [new TextRun({ text: "Problem: Backend won't start - says 'Address already in use'", bold: true })],
        spacing: { before: 240, after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Solution:", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "killall python3", font: "Courier New" })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("Then try starting backend again")],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Problem: Frontend won't start - says 'Port 3000 already in use'", bold: true })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Solution:", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "killall node", font: "Courier New" })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("Then try starting frontend again")],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Problem: Browser shows 'Cannot connect to server'", bold: true })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Check:", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("1. Is backend running? (Check Terminal 1)")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("2. Is frontend running? (Check Terminal 2)")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("3. Did you type http://localhost:3000 correctly?")],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Problem: Virtual environment won't activate", bold: true })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Check you're in the right directory:", bold: true })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "pwd", font: "Courier New" })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun("Should show: /home/civil/nhs-hr-rag/backend")],
        spacing: { after: 360 }
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // QUICK REFERENCE
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Quick Reference Card")] }),
      
      new Paragraph({
        children: [new TextRun({ text: "Complete Command Sequence (Copy/Paste):", bold: true, size: 26 })],
        spacing: { before: 240, after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Terminal 1 (Backend):", bold: true, color: "005EB8" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "cd ~/nhs-hr-rag/backend\nsource ../venv/bin/activate\npython3 api.py", font: "Courier New", size: 20 })],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Terminal 2 (Frontend):", bold: true, color: "005EB8" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "cd ~/nhs-hr-rag/frontend\nnpm run dev", font: "Courier New", size: 20 })],
        spacing: { after: 360 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "Browser:", bold: true, color: "005EB8" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "http://localhost:3000", font: "Courier New", size: 20 })],
        spacing: { after: 720 }
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "--- End of SOP ---", italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 720 }
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("NHS_HR_RAG_SOP_Startup_Shutdown.docx", buffer);
  console.log("✅ SOP document created!");
  console.log("📄 File: NHS_HR_RAG_SOP_Startup_Shutdown.docx");
});
