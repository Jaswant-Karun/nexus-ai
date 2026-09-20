import 'package:flutter/material.dart';

import 'project_details.dart';

class ProjectListScreen extends StatefulWidget {
  const ProjectListScreen({super.key});

  @override
  State<ProjectListScreen> createState() => _ProjectListScreenState();
}

class _ProjectListScreenState extends State<ProjectListScreen> {
  final List<_Project> _projects = [
    _Project('Website redesign', 'Design system and launch plan', .72, const Color(0xff2d6cdf)),
    _Project('Q3 marketing strategy', 'Campaign planning and insights', .48, const Color(0xff6f52c9)),
    _Project('Customer research', 'Interview synthesis and themes', .91, const Color(0xff16866b)),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Projects'), actions: [
        IconButton(tooltip: 'Search projects', onPressed: () {}, icon: const Icon(Icons.search)),
      ]),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _createProject,
        icon: const Icon(Icons.add),
        label: const Text('New project'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
        children: [
          const Text('Keep your work moving', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          const Text('Your active projects and their latest progress.', style: TextStyle(color: Color(0xff6c7890))),
          const SizedBox(height: 20),
          ..._projects.map(_projectCard),
        ],
      ),
    );
  }

  Widget _projectCard(_Project project) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      elevation: 0,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const ProjectDetailsScreen()),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
                CircleAvatar(backgroundColor: project.color.withValues(alpha: .12), child: Icon(Icons.folder_copy_outlined, color: project.color, size: 20)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(project.name, style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 3),
                Text(project.description, style: const TextStyle(fontSize: 12, color: Color(0xff6c7890))),
              ])),
              Text('${(project.progress * 100).round()}%', style: TextStyle(color: project.color, fontWeight: FontWeight.w700)),
            ]),
            const SizedBox(height: 18),
            LinearProgressIndicator(value: project.progress, minHeight: 7, borderRadius: BorderRadius.circular(10), color: project.color),
            const SizedBox(height: 12),
            const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Updated today', style: TextStyle(fontSize: 11, color: Color(0xff6c7890))), Text('View details', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xff2d6cdf)))]),
          ]),
        ),
      ),
    );
  }

  Future<void> _createProject() async {
    final controller = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Create project'),
        content: TextField(controller: controller, autofocus: true, decoration: const InputDecoration(labelText: 'Project name', hintText: 'e.g. Mobile launch')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(context, controller.text.trim()), child: const Text('Create')),
        ],
      ),
    );
    controller.dispose();
    if (name == null || name.isEmpty || !mounted) return;
    setState(() => _projects.insert(0, _Project(name, 'New workspace project', 0, const Color(0xff2d6cdf))));
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$name created')));
  }
}

class _Project {
  const _Project(this.name, this.description, this.progress, this.color);

  final String name;
  final String description;
  final double progress;
  final Color color;
}
