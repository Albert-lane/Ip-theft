#include "hv_sched.h"
#include "hv_traps.h"
#include "hv_log.h"
#include "hv_audit_datpa.h"
#include <stdio.h>

#define SCHED_MAX_SLOTS 8

static hv_vm_t *g_sched_queue[SCHED_MAX_SLOTS];
static uint32_t g_sched_count = 0;
static uint32_t g_current_slot = 0;
static uint64_t g_sched_ticks = 0;

bool hv_sched_init(void) {
    hv_log_info("Initializing Lane-VM Dual-Core Serial Hypervisor Scheduler");
    g_sched_count = 0;
    g_current_slot = 0;
    g_sched_ticks = 0;
    hv_audit_datpa_record_event(0, "SCHEDULER_ONLINE", "Deterministic serial time-slice scheduler ready");
    return true;
}

void hv_sched_register_vm(hv_vm_t *vm) {
    if (!vm || g_sched_count >= SCHED_MAX_SLOTS) return;
    g_sched_queue[g_sched_count++] = vm;
    hv_log_info("Scheduler registered VM %llu ('%s') into slot %u", 
                (unsigned long long)vm->vm_id, vm->vm_name, g_sched_count - 1);
}

void hv_sched_run(void) {
    g_sched_ticks++;

    // If queue is empty, attempt to discover registered VMs
    if (g_sched_count == 0) {
        hv_log_debug("Scheduler tick %llu: queue empty", (unsigned long long)g_sched_ticks);
        return;
    }

    // Serial round-robin execution slice
    hv_vm_t *vm = g_sched_queue[g_current_slot];
    if (vm && vm->state == HV_VM_STATE_RUNNING) {
        hv_traps_enter_guest(vm);
    }

    g_current_slot = (g_current_slot + 1) % g_sched_count;
}

uint64_t hv_sched_get_ticks(void) {
    return g_sched_ticks;
}
