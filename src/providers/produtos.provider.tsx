/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface ProdContextProps {
  produtos: ProdStateProps;
  setProdutos: React.Dispatch<React.SetStateAction<ProdStateProps>>;
  departamentos: string[];
  setDepartamentos: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDepartamento: string;
  setSelectedDepartamento: React.Dispatch<React.SetStateAction<string>>;
  orderByOptions: OderByOptionsProps[];
  selectedOrderBy: OderByOptionsProps;
  setSelectedOrderBy: React.Dispatch<React.SetStateAction<OderByOptionsProps>>;
  searchTextRef: React.Ref<HTMLInputElement>;
  handleFilterProducts: () => void;
}

export type ProdProps = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

type ProdStateProps = {
  unfiltered: ProdProps[];
  filtered: ProdProps[];
};

type OderByOptionsProps = {
  name: string;
  code: string;
};

export const ProdContext = createContext({} as ProdContextProps);

export const ProdProvider = ({ children }: any) => {
  var [produtos, setProdutos] = useState<ProdStateProps>({
    unfiltered: [],
    filtered: [],
  });

  const [departamentos, setDepartamentos] = useState<string[]>([]);

  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("");

  const orderByOptions: OderByOptionsProps[] = [
    {
      name: "Nome Ascendente",
      code: "NOA",
    },
    {
      name: "Nome Descescente",
      code: "NOD",
    },
    {
      name: "Maior Preço",
      code: "MEP",
    },
    {
      name: "Menor Preço",
      code: "MAP",
    },
  ];

  const [selectedOrderBy, setSelectedOrderBy] = useState<OderByOptionsProps>(
    orderByOptions[0]
  );

  const searchTextRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (produtos.unfiltered.length == 0 && produtos.filtered.length == 0) {
      handleFetchProdData();
    } else {
      const uniqueCategories = Array.from(
        new Set(produtos.unfiltered.map((item) => item.category))
      );
      uniqueCategories.push(`ALL`);
      setDepartamentos(uniqueCategories);
    }
  }, [produtos]);

  const handleFetchProdData = async () => {
    const limit = 100;
    try {
      const response = await axios.get<ProdProps[]>(
        `https://fakestoreapi.com/products`,
        {
          params: { limit },
        }
      );
      if (response && response.data) {
        setProdutos({
          unfiltered: response.data,
          filtered: response.data,
        });
        setSelectedDepartamento("ALL");
      }
    } catch (error) {
      console.error("Erro ao buscar listagem de produtos:", error);
      throw error;
    }
  };

  useEffect(() => {
    handleFilterProducts();
  }, [selectedDepartamento, selectedOrderBy]);

  const handleFilterProducts = () => {
    let produtosToOrderBy = produtos.unfiltered;
    const searchText = searchTextRef.current
      ? searchTextRef.current.value.toString().toUpperCase()
      : "";

    console.log("selectedOrderBy :", selectedOrderBy);
    console.log("selectedDepartamento :", selectedDepartamento);

    if (selectedOrderBy?.code === "MAP") {
      produtosToOrderBy = produtosToOrderBy.sort(function (
        a: ProdProps,
        b: ProdProps
      ) {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
        return 0;
      });
    } else if (selectedOrderBy?.code === "MEP") {
      produtosToOrderBy = produtosToOrderBy.sort(function (
        a: ProdProps,
        b: ProdProps
      ) {
        if (b.price > a.price) return 1;
        if (b.price < a.price) return -1;
        return 0;
      });
    } else if (selectedOrderBy?.code === "NOA") {
      produtosToOrderBy = produtosToOrderBy.sort(function (
        a: ProdProps,
        b: ProdProps
      ) {
        if (a.title.normalize("NFD") > b.title.normalize("NFD")) return 1;
        if (b.title.normalize("NFD") > a.title.normalize("NFD")) return -1;
        return 0;
      });
    } else if (selectedOrderBy?.code === "NOD") {
      produtosToOrderBy = produtosToOrderBy.sort(function (
        a: ProdProps,
        b: ProdProps
      ) {
        if (a.title.normalize("NFD") < b.title.normalize("NFD")) return 1;
        if (b.title.normalize("NFD") < a.title.normalize("NFD")) return -1;
        return 0;
      });
    }

    if (selectedDepartamento) {
      console.log("Filter by Depto");
      console.log('selectedDepartamento :', selectedDepartamento);
      produtosToOrderBy = produtosToOrderBy.filter(
        (prod: ProdProps) =>
          prod.category.toUpperCase() == selectedDepartamento.toUpperCase() ||
          selectedDepartamento == "ALL"
      );
    }

    if (searchText) {
      console.log("Filter by Search Text");
      produtosToOrderBy = produtosToOrderBy.filter(
        (prod: ProdProps) =>
          prod.category.toUpperCase().includes(searchText) ||
          prod.description.toUpperCase().includes(searchText) ||
          prod.title.toUpperCase().includes(searchText)
      );
    }

    console.log("produtosToOrderBy :", produtosToOrderBy);
    setProdutos((prev: ProdStateProps) => {
      return {
        ...prev,
        filtered: produtosToOrderBy,
      };
    });
  };

  return (
    <ProdContext.Provider
      value={{
        produtos,
        setProdutos,
        departamentos,
        setDepartamentos,
        selectedDepartamento,
        setSelectedDepartamento,
        orderByOptions,
        selectedOrderBy,
        setSelectedOrderBy,
        searchTextRef,
        handleFilterProducts,
      }}
    >
      {children}
    </ProdContext.Provider>
  );
};

export const useProdutos = () => useContext(ProdContext);
