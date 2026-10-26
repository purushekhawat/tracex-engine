package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/tracex/tracex-backend/internal/connector"
	"github.com/tracex/tracex-backend/internal/service"
)

type GraphHandler struct {
	graphSvc *service.GraphTraversalService
}

func NewGraphHandler(graphSvc *service.GraphTraversalService) *GraphHandler {
	return &GraphHandler{graphSvc: graphSvc}
}

func (h *GraphHandler) GetInvestigationGraph(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.PathValue("id")
	if id == "" {
		id = r.URL.Query().Get("id")
	}

	suspectAddr := "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
	now := time.Now().UTC()

	// Synthetic Graph Data for Cytoscape Visualization
	txs := []connector.NormalizedTransaction{
		{
			Blockchain:  "ethereum",
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
			FromAddress: suspectAddr,
			ToAddress:   "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			ValueNative: 10.0,
			ValueUSD:    32000.0,
			Timestamp:   now.Add(-72 * time.Hour),
		},
		{
			Blockchain:  "ethereum",
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0002",
			FromAddress: "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			ToAddress:   "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
			ValueNative: 9.85,
			ValueUSD:    31520.0,
			Timestamp:   now.Add(-48 * time.Hour),
		},
		{
			Blockchain:  "ethereum",
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003",
			FromAddress: "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
			ToAddress:   "0x28C6c06298d514Db089934071355E5743bf21d60",
			ValueNative: 9.80,
			ValueUSD:    31360.0,
			Timestamp:   now.Add(-24 * time.Hour),
		},
	}

	cyGraph := h.graphSvc.BuildCytoscapeGraph(r.Context(), id, suspectAddr, txs)

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(cyGraph)
}
