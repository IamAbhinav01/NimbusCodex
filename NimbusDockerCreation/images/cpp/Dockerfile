FROM gcc:13-bookworm
RUN apt-get update && apt-get install -y \
    cmake \
    gdb \
    valgrind \
    libssl-dev \
    nlohmann-json3-dev \
    libboost-system-dev \
    libboost-filesystem-dev \
    libboost-thread-dev \
    libboost-program-options-dev \
    libboost-regex-dev \
    libboost-date-time-dev \
    libboost-test-dev \
    && rm -rf /var/lib/apt/lists/*

CMD ["tail", "-f", "/dev/null"]
