CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2 -std=gnu11 -pthread -I.

SRCS = main.c hv_platform.c hv_mm.c hv_vm.c hv_traps.c hv_sched.c hv_log.c hv_audit_datpa.c
OBJS = $(SRCS:.c=.o)
TARGET = hv_core.elf

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean
