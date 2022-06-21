interface Veiculo {
  nome: string;
  placa: string;
  entradas: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);

  function calcTempo(mil: number) {
    const min = Math.floor(mil / 60000)
    const sec = Math.floor((mil % 60000) / 1000)

    return `${min}m e ${sec}s`

  }

  function patio() {
    function getCars(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }
    function createCars(veiculo: Veiculo, salvarLocalStorage?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entradas}</td>
            <td>
            <button class="delete" data-placa="${veiculo.placa}"> X </button>
            </td>
            `;
      row.querySelector(".delete")?.addEventListener("click", function () {
        deleteCars(this.dataset.placa)
      })

      $("#patio")?.appendChild(row);

      if (salvarLocalStorage) {
        salvar([...getCars(), veiculo]);
      }
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function deleteCars(placa: string) {
      const { entradas, nome } = getCars().find((veiculo) => veiculo.placa === placa);

      const tempo = calcTempo(
        new Date().getTime() - new Date(entradas).getTime()
      );

      if (
        !confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja Encerrar ?`)
      )
        return;

      salvar(getCars().filter((veiculo) => veiculo.placa !== placa))

      renderCars()


    }

    function renderCars() {
      $("#patio")!.innerHTML = "";
      const patio = getCars();

      if (patio.length) {
        patio.forEach((veiculo) => createCars(veiculo));
      }
    }

    return { getCars, createCars, renderCars, salvar };
  }

  patio().renderCars();

  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

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
