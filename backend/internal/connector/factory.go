package connector

import (
	"fmt"
	"strings"
	"sync"
)

type ProviderFactory struct {
	mu        sync.RWMutex
	providers map[string]BlockchainProvider
}

func NewProviderFactory() *ProviderFactory {
	return &ProviderFactory{
		providers: make(map[string]BlockchainProvider),
	}
}

func (f *ProviderFactory) RegisterProvider(chainCode string, provider BlockchainProvider) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.providers[strings.ToLower(chainCode)] = provider
}

func (f *ProviderFactory) GetProvider(chainCode string) (BlockchainProvider, error) {
	f.mu.RLock()
	defer f.mu.RUnlock()
	code := strings.ToLower(chainCode)
	provider, exists := f.providers[code]
	if !exists {
		return nil, fmt.Errorf("%w: '%s'", ErrUnsupportedChain, chainCode)
	}
	return provider, nil
}

func (f *ProviderFactory) ListSupportedChains() []string {
	f.mu.RLock()
	defer f.mu.RUnlock()
	chains := make([]string, 0, len(f.providers))
	for k := range f.providers {
		chains = append(chains, k)
	}
	return chains
}
