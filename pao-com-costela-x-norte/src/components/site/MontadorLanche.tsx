"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Cardapio, Carne, ItemCarrinho, Molho, Pao, TipoPedido } from "@/lib/types";
import { resolverPreco, formatarPreco } from "@/lib/price";
import { montarMensagemPedido, linkWhatsApp } from "@/lib/whatsapp";
import { criarPedidoSite } from "@/lib/actions/pedidos";
import { siteConfig } from "@/lib/site-config";

type Passo = 1 | 2 | 3 | 4;

export default function MontadorLanche({ cardapio }: { cardapio: Cardapio }) {
  const [passo, setPasso] = useState<Passo>(1);
  const [pao, setPao] = useState<Pao | null>(null);
  const [carne, setCarne] = useState<Carne | null>(null);
  const [mistoEscolhas, setMistoEscolhas] = useState<string[]>([]);
  const [molho, setMolho] = useState<Molho | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacaoItem, setObservacaoItem] = useState("");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoPedido>("retirada");
  const [endereco, setEndereco] = useState("");
  const [observacaoPedido, setObservacaoPedido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const precoAtual = useMemo(() => {
    if (!pao || !carne) return null;
    return resolverPreco(cardapio, pao.id, carne.id);
  }, [cardapio, pao, carne]);

  const outrasCarnesParaMisto = cardapio.carnes.filter((c) => !c.composta && c.disponivel);

  function selecionarPao(p: Pao) {
    if (!p.disponivel) return;
    setPao(p);
    setCarne(null);
    setMistoEscolhas([]);
    setMolho(null);
    setPasso(2);
  }

  function selecionarCarne(c: Carne) {
    if (!c.disponivel) return;
    setCarne(c);
    setMistoEscolhas([]);
    if (!c.composta) setPasso(3);
  }

  function alternarEscolhaMisto(nomeCarne: string) {
    setMistoEscolhas((atual) => {
      if (atual.includes(nomeCarne)) return atual.filter((n) => n !== nomeCarne);
      if (!carne) return atual;
      if (atual.length >= carne.qtd_escolhas) return atual;
      return [...atual, nomeCarne];
    });
  }

  function confirmarMisto() {
    if (!carne || mistoEscolhas.length !== carne.qtd_escolhas) return;
    setPasso(3);
  }

  function selecionarMolho(m: Molho) {
    if (!m.disponivel) return;
    setMolho(m);
    setPasso(4);
  }

  function adicionarAoCarrinho() {
    if (!pao || !carne || precoAtual === null) return;
    const item: ItemCarrinho = {
      paoId: pao.id,
      paoNome: pao.nome,
      carneId: carne.id,
      carneNome: carne.nome,
      carnesComposicao: mistoEscolhas.length ? mistoEscolhas : undefined,
      molhoId: molho?.id ?? null,
      molhoNome: molho?.nome ?? null,
      quantidade,
      precoUnitario: precoAtual,
      observacao: observacaoItem.trim() || undefined,
    };
    setCarrinho((c) => [...c, item]);
    setPao(null);
    setCarne(null);
    setMistoEscolhas([]);
    setMolho(null);
    setQuantidade(1);
    setObservacaoItem("");
    setPasso(1);
  }

  const subtotal = carrinho.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0);

  function linkFallback() {
    return linkWhatsApp(
      siteConfig.telefoneWhatsApp,
      montarMensagemPedido({ itens: carrinho, nome: nome || "Cliente", tipo, endereco, observacao: observacaoPedido })
    );
  }

  async function enviarPedido() {
    if (carrinho.length === 0 || !nome.trim()) return;
    setEnviando(true);
    setErro(null);
    try {
      await criarPedidoSite({
        itens: carrinho,
        tipo,
        clienteNome: nome,
        endereco: tipo === "entrega" ? endereco : undefined,
        observacao: observacaoPedido,
      });
      window.location.href = linkFallback();
    } catch {
      setErro("Não conseguimos registrar o pedido agora, mas você ainda pode enviar direto pelo WhatsApp.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="vidro rounded-3xl p-6 sm:p-8 space-y-10">
        <IndicadorPassos passoAtual={pao ? (carne ? (molho ? 4 : 3) : 2) : 1} />

        <PassoPaes ativo={passo === 1} paes={cardapio.paes} selecionado={pao} onSelecionar={selecionarPao} />

        {pao && (
          <PassoCarnes
            ativo={passo === 2}
            carnes={cardapio.carnes}
            pao={pao}
            cardapio={cardapio}
            selecionada={carne}
            onSelecionar={selecionarCarne}
            mistoEscolhas={mistoEscolhas}
            outrasCarnesParaMisto={outrasCarnesParaMisto}
            onAlternarMisto={alternarEscolhaMisto}
            onConfirmarMisto={confirmarMisto}
          />
        )}

        {pao && carne && (!carne.composta || mistoEscolhas.length === carne.qtd_escolhas) && (
          <PassoMolhos ativo={passo === 3} molhos={cardapio.molhos} selecionado={molho} onSelecionar={selecionarMolho} />
        )}

        {pao && carne && molho && passo === 4 && (
          <div className="borda-fina rounded-2xl p-6 space-y-4 bg-noite-2/40">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-wide text-papel/60">Quantidade</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="alvo-toque rounded-full bg-papel/10 hover:bg-papel/20 font-bold text-xl transition-colors"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="preco text-xl w-8 text-center">{quantidade}</span>
                <button
                  type="button"
                  className="alvo-toque rounded-full bg-papel/10 hover:bg-papel/20 font-bold text-xl transition-colors"
                  onClick={() => setQuantidade((q) => q + 1)}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            </div>
            <input
              className="alvo-toque w-full bg-transparent borda-fina rounded-xl px-4 text-papel placeholder:text-fumaca"
              placeholder="Observação (ex: sem vinagrete)"
              value={observacaoItem}
              onChange={(e) => setObservacaoItem(e.target.value)}
            />
            <button
              type="button"
              onClick={adicionarAoCarrinho}
              className="alvo-toque w-full rounded-xl bg-lona text-noite font-bold uppercase tracking-wide hover:brightness-110 transition-[filter]"
            >
              Adicionar ao pedido — {formatarPreco((precoAtual ?? 0) * quantidade)}
            </button>
          </div>
        )}
      </div>

      <aside className="vidro rounded-3xl p-6 space-y-4 h-fit lg:sticky lg:top-24">
        <h3 className="titulo-display text-xl">Seu pedido</h3>
        {carrinho.length === 0 ? (
          <p className="text-sm text-papel/50">Monte seu lanche ao lado.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {carrinho.map((item, i) => (
              <li key={i} className="flex justify-between gap-2 border-b border-papel/10 pb-2">
                <span className="text-papel/80">
                  {item.quantidade}x {item.paoNome} — {item.carneNome}
                  {item.molhoNome ? ` — ${item.molhoNome}` : ""}
                </span>
                <span className="preco whitespace-nowrap text-papel">{formatarPreco(item.precoUnitario * item.quantidade)}</span>
              </li>
            ))}
          </ul>
        )}

        {carrinho.length > 0 && (
          <>
            <PrecoAnimado valor={subtotal} />

            <div className="space-y-2">
              <input
                className="alvo-toque w-full bg-transparent borda-fina rounded-xl px-3 text-papel placeholder:text-fumaca text-sm"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <div className="flex gap-2 text-sm">
                {(["retirada", "entrega"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`alvo-toque flex-1 rounded-xl border uppercase text-xs transition-colors ${
                      tipo === t ? "bg-letrista/20 border-letrista text-papel" : "borda-fina text-papel/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {tipo === "entrega" && (
                <input
                  className="alvo-toque w-full bg-transparent borda-fina rounded-xl px-3 text-papel placeholder:text-fumaca text-sm"
                  placeholder="Endereço"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              )}
              <input
                className="alvo-toque w-full bg-transparent borda-fina rounded-xl px-3 text-papel placeholder:text-fumaca text-sm"
                placeholder="Observação do pedido"
                value={observacaoPedido}
                onChange={(e) => setObservacaoPedido(e.target.value)}
              />
            </div>

            {erro && (
              <div className="text-sm text-lona space-y-2">
                <p>{erro}</p>
                <a
                  href={linkFallback()}
                  className="alvo-toque flex items-center justify-center w-full rounded-xl bg-lona text-noite font-bold uppercase tracking-wide"
                >
                  Enviar pelo WhatsApp mesmo assim
                </a>
              </div>
            )}

            <button
              type="button"
              disabled={!nome.trim() || enviando}
              onClick={enviarPedido}
              className="alvo-toque w-full rounded-xl bg-brasa text-noite font-bold uppercase tracking-wide disabled:opacity-40 shadow-[0_0_30px_-8px_var(--color-brasa)] hover:shadow-[0_0_44px_-4px_var(--color-brasa)] transition-shadow"
            >
              {enviando ? "Enviando..." : "Enviar pedido pelo WhatsApp"}
            </button>
          </>
        )}
      </aside>
    </div>
  );
}

function PrecoAnimado({ valor }: { valor: number }) {
  const [pulsar, setPulsar] = useState(false);
  const anterior = useRef(valor);

  useEffect(() => {
    if (anterior.current !== valor) {
      setPulsar(true);
      anterior.current = valor;
      const t = setTimeout(() => setPulsar(false), 400);
      return () => clearTimeout(t);
    }
  }, [valor]);

  return (
    <p className="flex justify-between items-baseline font-bold titulo-display text-lg">
      <span className="text-papel/70 text-sm">Subtotal</span>
      <span className={`preco text-2xl text-brasa ${pulsar ? "preco-mudou" : ""}`}>{formatarPreco(valor)}</span>
    </p>
  );
}

function IndicadorPassos({ passoAtual }: { passoAtual: Passo }) {
  const nomes = ["Pão", "Carne", "Molho", "Pronto"];
  return (
    <div className="flex items-center" aria-hidden="true">
      {nomes.map((nome, i) => {
        const n = (i + 1) as Passo;
        const ativo = n <= passoAtual;
        return (
          <div key={nome} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold titulo-display transition-colors ${
                  ativo ? "bg-brasa text-noite" : "borda-fina text-papel/40"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-wide ${ativo ? "text-papel/80" : "text-papel/30"}`}>{nome}</span>
            </div>
            {i < nomes.length - 1 && (
              <div className={`h-px flex-1 mx-2 transition-colors ${n < passoAtual ? "bg-brasa" : "bg-papel/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CamadaSanduiche({ passo }: { passo: Passo }) {
  return (
    <div className="flex flex-col items-center gap-1 h-24 justify-end" aria-hidden="true">
      {passo >= 3 && (
        <div
          className="w-24 h-2 rounded-full bg-brasa shadow-[0_0_16px_-2px_var(--color-brasa)]"
          style={{ animation: "cair 0.3s ease-out" }}
        />
      )}
      {passo >= 2 && <div className="w-28 h-6 rounded-sm bg-fumaca" style={{ animation: "cair 0.3s ease-out" }} />}
      <div className="w-32 h-5 rounded-t-full bg-lona" style={{ animation: "cair 0.3s ease-out" }} />
    </div>
  );
}

function PassoPaes({
  ativo,
  paes,
  selecionado,
  onSelecionar,
}: {
  ativo: boolean;
  paes: Pao[];
  selecionado: Pao | null;
  onSelecionar: (p: Pao) => void;
}) {
  return (
    <section className={ativo ? "" : "opacity-50"}>
      <h3 className="titulo-display text-lg mb-3 text-papel/60">Escolha o pão</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {paes.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={!p.disponivel}
            onClick={() => onSelecionar(p)}
            className={`alvo-toque p-4 rounded-xl border text-left transition-all ${
              selecionado?.id === p.id
                ? "border-brasa bg-brasa/10 shadow-[0_0_24px_-8px_var(--color-brasa)]"
                : "borda-fina hover:border-papel/30"
            } ${!p.disponivel ? "opacity-30" : ""}`}
          >
            <p className="font-bold">{p.nome}</p>
            <p className="preco text-sm text-papel/60">
              {p.preco_base === null ? "preço não definido" : formatarPreco(p.preco_base)}
            </p>
            {!p.disponivel && <p className="text-xs uppercase text-lona mt-1">acabou hoje</p>}
          </button>
        ))}
      </div>
    </section>
  );
}

function PassoCarnes({
  ativo,
  carnes,
  pao,
  cardapio,
  selecionada,
  onSelecionar,
  mistoEscolhas,
  outrasCarnesParaMisto,
  onAlternarMisto,
  onConfirmarMisto,
}: {
  ativo: boolean;
  carnes: Carne[];
  pao: Pao;
  cardapio: Cardapio;
  selecionada: Carne | null;
  onSelecionar: (c: Carne) => void;
  mistoEscolhas: string[];
  outrasCarnesParaMisto: Carne[];
  onAlternarMisto: (nome: string) => void;
  onConfirmarMisto: () => void;
}) {
  return (
    <section className={ativo ? "" : "opacity-50"}>
      <h3 className="titulo-display text-lg mb-3 text-papel/60">Escolha a carne</h3>
      <CamadaSanduiche passo={selecionada ? 3 : 2} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {carnes.map((c) => {
          const preco = resolverPreco(cardapio, pao.id, c.id);
          return (
            <button
              key={c.id}
              type="button"
              disabled={!c.disponivel}
              onClick={() => onSelecionar(c)}
              className={`alvo-toque p-4 rounded-xl border text-left transition-all ${
                selecionada?.id === c.id
                  ? "border-brasa bg-brasa/10 shadow-[0_0_24px_-8px_var(--color-brasa)]"
                  : "borda-fina hover:border-papel/30"
              } ${!c.disponivel ? "opacity-30" : ""}`}
            >
              <p className="font-bold">{c.nome}</p>
              <p className="preco text-sm text-papel/60">{formatarPreco(preco)}</p>
              {!c.disponivel && <p className="text-xs uppercase text-lona mt-1">acabou hoje</p>}
            </button>
          );
        })}
      </div>

      {selecionada?.composta && (
        <div className="mt-4 borda-fina rounded-xl p-4 space-y-3 border-letrista/50">
          <p className="text-sm text-papel/70">
            Escolha {selecionada.qtd_escolhas} carnes para o misto ({mistoEscolhas.length}/{selecionada.qtd_escolhas})
          </p>
          <div className="flex flex-wrap gap-2">
            {outrasCarnesParaMisto.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onAlternarMisto(c.nome)}
                className={`alvo-toque px-4 rounded-full border text-sm transition-colors ${
                  mistoEscolhas.includes(c.nome) ? "bg-letrista/30 border-letrista" : "borda-fina text-papel/60"
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={mistoEscolhas.length !== selecionada.qtd_escolhas}
            onClick={onConfirmarMisto}
            className="alvo-toque rounded-full bg-lona text-noite font-bold px-6 uppercase text-sm disabled:opacity-40"
          >
            Confirmar composição
          </button>
        </div>
      )}
    </section>
  );
}

function PassoMolhos({
  ativo,
  molhos,
  selecionado,
  onSelecionar,
}: {
  ativo: boolean;
  molhos: Molho[];
  selecionado: Molho | null;
  onSelecionar: (m: Molho) => void;
}) {
  return (
    <section className={ativo ? "" : "opacity-50"}>
      <h3 className="titulo-display text-lg mb-3 text-papel/60">Escolha o molho</h3>
      <CamadaSanduiche passo={4} />
      <div className="flex flex-wrap gap-3 mt-3">
        {molhos.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={!m.disponivel}
            onClick={() => onSelecionar(m)}
            className={`alvo-toque px-5 rounded-full border flex items-center gap-2 transition-all ${
              selecionado?.id === m.id
                ? "border-brasa bg-brasa/10 shadow-[0_0_24px_-8px_var(--color-brasa)]"
                : "borda-fina hover:border-papel/30"
            } ${!m.disponivel ? "opacity-30" : ""}`}
          >
            {m.cor_hex && (
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: m.cor_hex }} />
            )}
            {m.nome}
            {!m.disponivel && <span className="text-xs uppercase text-lona ml-1">acabou hoje</span>}
          </button>
        ))}
      </div>
    </section>
  );
}
