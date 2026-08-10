# Local testing only. The published site is static files with no build step —
# this exists because the tables under data/ are fetched over HTTP, and file://
# will not do that (see README).
PORT ?= 8138

# First target, so a bare `make` still serves.
# Bound to loopback on purpose: a draft in localStorage holds real trip details,
# and http.server otherwise offers the folder to everything on the network.
serve: ## Serve the app locally for testing
	@echo "itinerary → http://localhost:$(PORT)/"
	@python3 -m http.server $(PORT) --bind 127.0.0.1

# Lists whichever targets carry a `## ` comment, so a new target documents
# itself by being written rather than by being added here as well.
help: ## Show this help
	@echo "usage: make [target] [PORT=n]"
	@echo
	@grep -hE '^[a-z][a-z-]*:.*##' $(MAKEFILE_LIST) | sort | awk -F':.*## ' '{printf "  %-6s  %s\n",$$1,$$2}'
	@echo
	@echo "  PORT defaults to $(PORT); the server binds 127.0.0.1 only."

.PHONY: serve help
