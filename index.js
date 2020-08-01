function doCORSRequest(options, printResult) {
  var cors_api_url = "https://cors-anywhere.herokuapp.com/";
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, cors_api_url + options.url);

  xhr.onload = xhr.onerror = () => {
    printResult({
      method: options.method,
      url: options.url,
      status: xhr.status,
      statusText: xhr.statusText,
      responseText: xhr.responseText,
    });
  };

//   if (/^POST/i.test(options.method))
    xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(options.data);
}

function getPrograms(dataField = JSON.stringify({"program":"Biochemistry - Major"})){
    var urlField = document.getElementById("url");
    var outputField = document.getElementById("output");
    var programsField = document.getElementById("programs");

    doCORSRequest(
        {
          method: "GET",
          url: "https://us-central1-mohamed-halat.cloudfunctions.net/UTSC_API",
          data: dataField,
        },
        function printResult(result) {
          var data = JSON.parse(result.responseText);
          data.programs.forEach((element) => {
            var option = document.createElement("option");
            option.text = element.name;
            option.value = element.name;
            programsField.add(option);
          });
          outputField.innerText = JSON.stringify(data);
        }
      );
}

const init = () => {

        getPrograms()

    document.getElementById("submit").onclick = function (e) {
      e.preventDefault();
      console.log(`${document.getElementById("programs").value}`);

      var data = JSON.stringify({"program":document.getElementById("programs").value});
      var urlField = document.getElementById("url");
      var outputField = document.getElementById("output");
      var programsField = document.getElementById("programs");
      
      doCORSRequest(
        {
          method: "POST",
          url: "https://us-central1-mohamed-halat.cloudfunctions.net/UTSC_API",
          data: data,
        },
        function printResult(result) {
          var data = JSON.parse(result.responseText);
          outputField.innerText = JSON.stringify(data.courses);

          var itm = document.getElementById("course-card");
          itm.style.display="";

          Object.keys(data.courses).forEach(req => {
              data.courses[req].forEach( course => {

                doCORSRequest(
                  {
                    method: "GET",
                    url: `https://nikel.ml/api/courses?code=${course}`,
                    data: data,
                  },
                  function pr(r){
                    console.log(JSON.parse(r.responseText))
                  }
                )
                var cln = itm.cloneNode(true);
                cln.id = `${course}-card`
                cln.children[0].id = `${course}-body`
                cln.children[0].children[0].id = `${course}-title`
                cln.children[0].children[0].innerText = `${course}`
                cln.children[0].children[1].innerText = `${req}`
                console.log(cln.id)
                document.getElementById("courses-cards").appendChild(cln);
              })
          });
        itm.style.display="none";
        }
      );
    };
  
};

window.onload = () => init();
