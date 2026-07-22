"""Entry point cPanel's Passenger-based Python App looks for by default."""

import os
import sys

# Passenger may not launch this with the app root as the working directory,
# so the "config" package wouldn't otherwise be importable.
sys.path.insert(0, os.path.dirname(__file__))

from config.wsgi import application  # noqa: E402,F401
