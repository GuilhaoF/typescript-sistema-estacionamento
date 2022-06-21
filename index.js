(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function getCars() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function createCars(veiculo, salvarLocalStorage) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entradas}</td>
            <td>
            <button class="delete" data-placa="${veiculo.placa}"> X </button>
            </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                deleteCars(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salvarLocalStorage) {
                salvar([...getCars(), veiculo]);
            }
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function deleteCars(placa) {
            const { entradas, nome } = getCars().find((veiculo) => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entradas).getTime());
            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja Encerrar ?`))
                return;
            salvar(getCars().filter((veiculo) => veiculo.placa !== placa));
            renderCars();
        }
        function renderCars() {
            $("#patio").innerHTML = "";
            const patio = getCars();
            if (patio.length) {
                patio.forEach((veiculo) => createCars(veiculo));
            }
        }
        return { getCars, createCars, renderCars, salvar };
    }
    patio().renderCars();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("campos vazios");
            return;
        }
        patio().createCars({
            nome,
            placa,
            entradas: new Date().toISOString(),
        }, true);
    });
})();
