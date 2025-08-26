// ...dentro do <tbody>
<td className="py-1 px-2">
  <button
    onClick={() => delAluno(a.id)}
    className="bg-red-500 text-white px-2 rounded"
    onMouseOver={() => setToast('Remover um aluno não apaga seus envios!')}
    onMouseOut={() => setToast('')}
  >Remover</button>
</td>