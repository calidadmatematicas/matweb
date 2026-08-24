

const syllabusUrl = "syllabus.html";
//const csvurl = "csvfile.csv";
let csvData = {semestres: [], ciclos: [], cursos: [], docentes: [], links: [], pdfs: []};

export async function loadCSVData() {
  try {
    let csvText = "";
    const response = await fetch("./Carga Académica 2021-2025.csv");
    csvText = await response.text();
    /*fetch(csvurl)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        csvText = data;
      });*/

    console.log(csvText);

    const rows = csvText.split('\n');
    let count = 0;
    for (const row of rows) {
      if (row.trim().length > 0) {
        const values = row.split(',');
        if (values[0] === "SEMESTRE") {
            // header, so do nothing
        } else {
            csvData.semestres.push(values[0]);
            csvData.ciclos.push(values[1]);
            csvData.cursos.push(values[2]);
            csvData.docentes.push(values[3]);
            csvData.links.push(values[4]);
            csvData.pdfs.push(values[5]);
        }
      }
      count++;
    }
    console.log("Rows count: ", count);
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
}

export function openSyllabusPage() {
  try {
    // docente
    let docente = document.getElementById("username").value;
    docente = docente.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    docente = docente.trim().toUpperCase();

    const params = new URLSearchParams({
        docente: docente,
    });
    
    if (docente === "") {
        // do nothing
    } else {
        let found = csvData.docentes.includes(docente);
        if (found) {
          const syllabusUrl = `syllabus.html?${params.toString()}`;
          console.log(syllabusUrl);
          //window.open(syllabusUrl, "_self");
          window.location.href = syllabusUrl;
        }
        else {
          const errElement = document.getElementById("errorelement");
          errElement.innerHTML = `
          <div class="errpanel">
          <i class="fa fa-exclamation-triangle"></i> &nbsp; <span style="font-style: italic;">Nombre inválido, por favor intente de nuevo</span>
          </div>`;
        }
    }
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
}

function generateSyllabusSheetHTML(sem) {
  return `
      <div class="sheet" id="${sem}">
        <div class="sheet-id">SEMESTRE ACADÉMICO</div>
        <h3 class="semestre">
          <img src="bookmarkfill.svg" alt="bookmark" height="21">
          <span>${sem}</span>
        </h3>
        <div class="courses">
        </div>
      </div>
      `;
}

function generateSyllabusCourseHTML(curso, link, pdf) {
  if (pdf === "")
    return `
        <div class="cursocontainter">
          <a class="curso" target="_blank"
            href="${link}">
            <span>·</span><span class="nombrecurso">${curso}</span><img src="excel.png" alt="excel" height="24">
          </a>
          <a class="silabopdf" target="_blank"
            href=""><img src="pdft.png" alt="silabo" height="26"></a>
        </div>
        `
  else
    return `
        <div class="cursocontainter">
          <a class="curso" target="_blank"
            href="${link}">
            <span>·</span><span class="nombrecurso">${curso}</span><img src="excel.png" alt="excel" height="24">
          </a>
          <a class="silabopdf" target="_blank"
            href="${pdf}"><img src="pdf.png" alt="silabo" height="26"></a>
        </div>
        `;
}

export function loadSyllabusPage() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const docente = urlParams.get('docente');

  const semActive = [false,false,false,false,false,false,false,false,false,false];
  const indices = [];
  const len = csvData.docentes.length; // Cache length to avoid checking it every iteration
  
  document.getElementById("bienvenidoDocente").innerHTML = `Docente: ${docente}`;

  for (let i = 0; i < len; i++) {
      if (csvData.docentes[i] === docente) {
          indices.push(i);
          if (csvData.semestres[i] === "2021-I") semActive[0] = true;
          else if (csvData.semestres[i] === "2021-II") semActive[1] = true;
          else if (csvData.semestres[i] === "2022-I") semActive[2] = true;
          else if (csvData.semestres[i] === "2022-II") semActive[3] = true;
          else if (csvData.semestres[i] === "2023-I") semActive[4] = true;
          else if (csvData.semestres[i] === "2023-II") semActive[5] = true;
          else if (csvData.semestres[i] === "2024-I") semActive[6] = true;
          else if (csvData.semestres[i] === "2024-II") semActive[7] = true;
          else if (csvData.semestres[i] === "2025-I") semActive[8] = true;
          else if (csvData.semestres[i] === "2025-II") semActive[9] = true;
      }
  }

  let sheetsHTML = "";
  if (semActive[0]) sheetsHTML += generateSyllabusSheetHTML("2021-I");
  if (semActive[1]) sheetsHTML += generateSyllabusSheetHTML("2021-II");
  if (semActive[2]) sheetsHTML += generateSyllabusSheetHTML("2022-I");
  if (semActive[3]) sheetsHTML += generateSyllabusSheetHTML("2022-II");
  if (semActive[4]) sheetsHTML += generateSyllabusSheetHTML("2023-I");
  if (semActive[5]) sheetsHTML += generateSyllabusSheetHTML("2023-II");
  if (semActive[6]) sheetsHTML += generateSyllabusSheetHTML("2024-I");
  if (semActive[7]) sheetsHTML += generateSyllabusSheetHTML("2024-II");
  if (semActive[8]) sheetsHTML += generateSyllabusSheetHTML("2025-I");
  if (semActive[9]) sheetsHTML += generateSyllabusSheetHTML("2025-II");

  document.getElementById("syllabusSheet").innerHTML = sheetsHTML;

  console.log("el nombre del docente es: ", docente);

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    const sheet = document.getElementById(csvData.semestres[index]);
    const container = sheet.querySelector('.courses');
    container.innerHTML += generateSyllabusCourseHTML(csvData.cursos[index], csvData.links[index], csvData.pdfs[index]);
  }
}
