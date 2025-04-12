<template>
    <v-card-text>
        <v-form ref="form" v-model="formValid">
            <v-text-field
                variant="outlined"
                v-model="editedProfile.name"
                label="Full Name"
                :rules="[required]"
            />
            <v-date-input
                v-model="birthDateModel"
                clearable
                label="Birth Date"
                variant="outlined"
                :rules="[required]"
            />
            <v-text-field
                variant="outlined"
                v-model.number="editedProfile.height"
                label="Height (cm)"
                type="number"
                :rules="[required]"
            />
            <v-text-field
                variant="outlined"
                v-model.number="editedProfile.defaultCalorieGoal"
                label="Default Daily Calorie Goal"
                type="number"
                :rules="[required, betweenValues(1200, 5000)]"
                hint="This will be used as your starting goal for each day"
                min="1200"
                max="5000"
                step="50"
            />
            <v-select
                variant="outlined"
                v-model="editedProfile.gender"
                :items="genderOptions"
                label="Gender"
                :rules="[required]"
            />
            <v-text-field
                variant="outlined"
                v-model="editedProfile.profilePictureUrl"
                label="Profile Picture URL"
            />
        </v-form>
    </v-card-text>
    <v-card-actions>
        <v-spacer />
        <v-btn @click="emitClose">Cancel</v-btn>
        <v-btn color="primary" :disabled="!formValid" @click="saveProfile"> Save </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { UserProfile } from "../../types/user-profile";

import { dateToIsoString } from "../../helpers/date-utils";
import { betweenValues, required } from "../../helpers/form-validators";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores/global";

const props = defineProps<{
    initialProfile: null | UserProfile;
}>();

const emit = defineEmits<{
    (e: "profileSaved", profile: UserProfile): void;
    (e: "close"): void;
}>();

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const genderOptions = ["Male", "Female"];

const editedProfile = ref<UserProfile>({
    birthDate: "",
    defaultCalorieGoal: 2000,
    gender: "Male",
    height: 0,
    id: authStore.nonNullableUser.uid,
    name: "",
    profilePictureUrl: "",
});

if (props.initialProfile) {
    editedProfile.value = {
        ...props.initialProfile,
        defaultCalorieGoal: props.initialProfile.defaultCalorieGoal ?? 2000,
    };
}

const form = ref();
const formValid = ref(false);

const birthDateModel = computed({
    get() {
        return editedProfile.value.birthDate ? new Date(editedProfile.value.birthDate) : null;
    },
    set(newValue: Date | null) {
        if (newValue) {
            editedProfile.value.birthDate = dateToIsoString(newValue);
        } else {
            editedProfile.value.birthDate = "";
        }
    },
});

function emitClose(): void {
    emit("close");
}

async function saveProfile(): Promise<void> {
    try {
        await authStore.updateProfile(editedProfile.value);
        globalStore.notify("Profile saved successfully!");
        emit("profileSaved", { ...editedProfile.value });
        emit("close");
    } catch {
        globalStore.notifyError("Failed to save profile.");
    }
}
</script>
