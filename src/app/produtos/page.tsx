"use client";

import { ProdProps, useProdutos } from "@/providers/produtos.provider";
import styles from "./page.produtos.module.css";
import ProdCard from "../../components/prodCard/prodCard";
import { Input, Select } from "reactivus";

export default function Produtos() {
  const {
    produtos,
    departamentos,
    selectedDepartamento,
    setSelectedDepartamento,
    orderByOptions,
    selectedOrderBy,
    setSelectedOrderBy,
    searchTextRef,
    handleFilterProducts
  } = useProdutos();

  return (
    <section className={styles.produtosMainBox}>
      <div className={styles.produtosHeaderBox}>
        <Input
          label="Buscar produtos"
          palceholder="Buscar produtos"
          type={"text"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFilterProducts()
          }
          inputRef={searchTextRef}
        />
        <Select
          options={departamentos}
          optionLabel={""}
          value={selectedDepartamento}
          onChange={(e) => {
            setSelectedDepartamento(e.value);
          }}
          placeholder="Filtrar departamento"
          label="Departamento"
        />
        <Select
          options={orderByOptions}
          optionLabel={"name"}
          value={selectedOrderBy}
          onChange={(e) => {
            setSelectedOrderBy(e.value);
          }}
          placeholder="Ordenar"
          label="Ordenar por"
        />
      </div>
      {produtos.filtered?.map((prod: ProdProps) => {
        return <ProdCard key={prod.id} prod={prod} />;
      })}
    </section>
  );
}
