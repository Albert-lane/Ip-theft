#pragma once
#include <stdbool.h>
#include <stdint.h>
#include "hv_vm.h"

bool hv_sched_init(void);
void hv_sched_run(void);
void hv_sched_register_vm(hv_vm_t *vm);
uint64_t hv_sched_get_ticks(void);
