https://mermaid.js.org/syntax/stateDiagram.html

---

:::mermaid

stateDiagram-v2
    state if_done <<choice>>

    [*] --> doc_summarizer
    doc_summarizer --> if_done
    if_done --> doc_summarizer : not done
    if_done --> [*] : done
:::

---

